function doGet(e) {
  let userAgent = e.headers["User-Agent"];
  let client = e.headers["X-Forwarded-For"];
  console.log("User-Agent: " + userAgent +"\n"+ "Client: " + client);

  // パラメーターから暗号化されたフォルダIDを取得
  let param = e.parameter.folder;
  // httpリクエスト内で+がスペースに変換されるため、スペースを+に変換
  param = param.replace(/ /g, "+");
  // どのチームのWebhookに送信するか取得
  let team = e.parameter.team;
  postToDiscordWebhook(decoding(param), team);
}

/**
 * Google Drive 更新通知をDiscordに送信
 * @param {Discord送信メッセージ} message
 */
function postToDiscordWebhook(folderId, propertyName) {
  // Webhook URLを取得
  if (propertyName == null || checkString(propertyName) == false) {
    console.error("Webhook URLが設定されていません");
    return;
  }

  const url = PropertiesService.getScriptProperties().getProperty(propertyName);
  // フォルダのURLと名前を取得
  let folder = DriveApp.getFolderById(folderId);
  let driveName = folder.getName();
  let driveUrl = folder.getUrl();

  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      content: "Google Drive 変更通知",
      embeds: [
        {
          title: driveName,
          url: driveUrl,
          description: "ビルドファイルが更新されました",
          color: 5620992,
        },
      ],
    }),
  });
}

function checkString(line) {
  if (typeof line === "string") {
    return true;
  } else {
    return false;
  }
}

function encoding(line) {
  try {
    let key = PropertiesService.getScriptProperties().getProperty("AES_KEY");

    if (checkString(line) == true) {
      let cipher = new cCryptoGS.Cipher(key, "aes");
      return cipher.encrypt(line);
    } else {
      throw new Error("引数が文字列ではありません");
    }
  } catch (err) {
    console.log("エラーが発生しました: %s", err.message);
  }
}

function decoding(line) {
  try {
    let key = PropertiesService.getScriptProperties().getProperty("AES_KEY");

    if (checkString(line) == true) {
      let cipher = new cCryptoGS.Cipher(key, "aes");
      return cipher.decrypt(line);
    } else {
      throw new Error("引数が文字列ではありません");
    }
  } catch (err) {
    console.log("エラーが発生しました: %s", err.message);
  }
}

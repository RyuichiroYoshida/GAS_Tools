function test() {
  aes = encoding();
  console.log(aes);
}

function doGet(e) {
  folderId = decoding(e.parameter.id);

  postToDiscordWebhook(folderId);
}

/**
 * Google Drive 更新通知をDiscordに送信
 * @param {Discord送信メッセージ} message
 */
function postToDiscordWebhook(folderId) {
  const url = PropertiesService.getScriptProperties().getProperty(
    "DISCORD_WEBHOOK_URL"
  );
  // フォルダのURLと名前を取得
  let driveLink = DriveApp.getFolderById(folderId).getUrl();
  let driveName = DriveApp.getFolderById(folderId).getName();

  UrlFetchApp.fetch(url, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      content: "Google Drive 変更通知",
      embeds: [
        {
          title: driveName,
          url: driveLink,
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
    if (checkString(line) == true) {
      let cipher = new cCryptoGS.Cipher(line, "key");
      let encryptedMessage = cipher.encrypt(
        "this is my message to be encrypted"
      );
      console.log(encryptedMessage);
    } else {
      throw new Error("引数が文字列ではありません");
    }
  } catch (err) {
    console.log("エラーが発生しました: %s", err.message);
  }
}

function decoding(line) {
  try {
    if (checkString(line) == true) {
      let decryptedMessage = cipher.decrypt(line);
      console.log(decryptedMessage);
    } else {
      throw new Error("引数が文字列ではありません");
    }
  } catch (err) {
    console.log("エラーが発生しました: %s", err.message);
  }
}

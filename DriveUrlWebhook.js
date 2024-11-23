function doGet(e) {
  encoding(e.parameter.folderId);
  console.log(encryptedMessage);

  // TODO フォルダIDからフォルダのURLを取得する
  // TODO フォルダのURLを Discord Webhookに送信する
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

function doGet(e) {
  // 環境変数からフォルダIDを取得
  const folderId = PropertiesService.getScriptProperties().getProperty("FOLDER_ID");

  let res = zipAndDownload(folderId);

  // ContentService を使用して文字列を返す
  return ContentService.createTextOutput(res).setMimeType(ContentService.MimeType.TEXT);
}

/**
 * 指定されたGoogleドライブフォルダ内のすべてのファイルを含むZIPファイルを作成します。
 * フォルダと同じ名前のZIPファイルが既に存在する場合、それは削除されます。
 *
 * @param {string} folderId - ZIP化するGoogleドライブフォルダのID。
 * @returns {string|null} 作成されたZIPファイルのURL、またはフォルダが空の場合はnull。
 */
function createZip(folderId) {
  let folder = DriveApp.getFolderById(folderId);
  let folderName = folder.getName();

  let files = folder.getFiles();
  let blobs = [];

  // フォルダ内のすべてのファイルを取得し、Blob の配列を作成
  while (files.hasNext()) {
    let file = files.next();
    if (file.getName() == folderName + ".zip") {
      // 前回実行時の ZIP ファイルを削除
      file.setTrashed(true);
      continue;
    }
    blobs.push(file.getBlob());
  }

  // Blob 配列を ZIP ファイルに圧縮
  if (blobs.length > 0) {
    let zipBlob = Utilities.zip(blobs, folderName + ".zip");

    // ZIP ファイルをフォルダ内に作成
    let zipFile = folder.createFile(zipBlob);
    console.log("ZIPファイルのURL: " + zipFile.getUrl());
    return zipFile.getUrl();
  } else {
    console.log("フォルダ内にファイルがありません。");
    return null;
  }
}

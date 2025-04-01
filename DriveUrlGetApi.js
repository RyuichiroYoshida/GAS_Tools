function main() {
  // テスト用のフォルダID（本番環境では環境変数などから取得するべき）
  let folderId = "12Y7fCgWIg5o1vp2ooSwZt3OXqaUbXtR3";

  zipAndDownload(folderId);

  //   let files = DriveApp.getFolderById(folderId).getFiles();

  //   console.log(files.hasNext());
  //   while (files.hasNext()) {
  //     var file = files.next();
  //     console.log("File Name: " + file.getName());
  //     console.log("File ID: " + file.getId());
  //     console.log("File URL: " + file.getUrl());
  //   }
}

function zipAndDownload(folderId) {
  var folder = DriveApp.getFolderById(folderId);
  var folderName = folder.getName();

  var files = folder.getFiles();
  var blobs = [];

  // フォルダ内のすべてのファイルを取得し、Blob の配列を作成
  while (files.hasNext()) {
    var file = files.next();
    if (file.getName() === folderName) {
      // 前回実行時の ZIP ファイルを削除
      file.setTrashed(true);
      continue;
    }
    blobs.push(file.getBlob());
  }

  // Blob 配列を ZIP ファイルに圧縮
  if (blobs.length > 0) {
    var zipBlob = Utilities.zip(blobs, folder.getName() + ".zip");

    // ZIP ファイルをフォルダ内に作成
    var zipFile = folder.createFile(zipBlob);
    console.log("ZIPファイルのURL: " + zipFile.getUrl());
  } else {
    console.log("フォルダ内にファイルがありません。");
  }
}

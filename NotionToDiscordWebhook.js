function doPost(e) {
  const params = JSON.parse(e.postData.getDataAsString());

  postToDiscordWebhook(params);

  return ContentService.createTextOutput(params?.challenge);
}

function debug(msg) {
  try {
    const sheetId = "1NmJc7CDNMN_OWgUdyq7AlZEHO4UBYyCNAXsYONqnt9A";
    const spreadsheet = SpreadsheetApp.openById(sheetId);
    const sheet = spreadsheet.getSheetByName("シート1");

    let prop = msg.data.properties;
    let title = prop.バグ概要.title[0].plain_text + " ";
    let low = sheet.getLastRow();
    sheet.getRange(low + 1, 1).setValue(title);

    prop.担当者.multi_select.forEach((element) => {
      let low = sheet.getLastRow();
      sheet.getRange(low + 1, 1).setValue(element.name);
    });

    prop.発生箇所.multi_select.forEach((element) => {
      let low = sheet.getLastRow();
      sheet.getRange(low + 1, 1).setValue(element.name);
    });
  } catch (e) {}
}

/**
 * Description Google Drive 更新通知をDiscordに送信
 * @param {any} contentJson
 * @returns {any}
 */
function postToDiscordWebhook(contentJson) {
  const webhookUrl = PropertiesService.getScriptProperties().getProperty("C");

  let pageUrl = contentJson.url;

  let prop = contentJson.data.properties;

  let pageTitle = prop.バグ概要.title[0].plain_text;

  let person = "";
  // prop.担当者.multi_select.forEach((element) => {
  //   person += element.name + " ";
  // });

  let issue = "";
  // prop.発生箇所.multi_select.forEach((element) => {
  //   issue += element.name + " ";
  // });

  UrlFetchApp.fetch(webhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({
      content: "Notionに新しい投稿があります！",
      embeds: [
        {
          title: pageTitle,
          url: pageUrl,
          description: "担当者: " + person + "\n" + "発生箇所: " + issue,
          color: 5620992,
        },
      ],
    }),
  });
}

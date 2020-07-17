// LINE developersのメッセージ送受信設定に記載のアクセストークン
var ACCESS_TOKEN = "<Your Access Token>";

// 整理番号を取得する
function getAndIncrementNumber() {
  //1. 現在のスプレッドシートを取得
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  //2. 現在のシートを取得
  var sheet = spreadsheet.getActiveSheet();
  //3. 指定するセルの範囲（A1）を取得
  var range = sheet.getRange("A1");
  //4. 値を取得する
  var value = range.getValue();
  //5. +1する
  range.setValue(value + 1);

  return value;
}

// LINEでユーザーからメッセージが送信されると、ここの処理が動く
function doPost(e) {
  // 返信するメッセージ変えたい場合はここを編集する。
  var replyMessages = [
    {
      type: "text",
      text: getAndIncrementNumber() + "番でお呼びします。",
    },
  ];

  // ----------------------------------------------------------↓はおまじない
  // WebHookで受信した応答用Token
  var replyToken = JSON.parse(e.postData.contents).events[0].replyToken;
  // 応答メッセージ用のAPI URL
  var url = "https://api.line.me/v2/bot/message/reply";
  UrlFetchApp.fetch(url, {
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      Authorization: "Bearer " + ACCESS_TOKEN,
    },
    method: "post",
    payload: JSON.stringify({
      replyToken: replyToken,
      messages: replyMessages,
    }),
  });

  return ContentService.createTextOutput(
    JSON.stringify({ content: "post ok" })
  ).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var headers = [
    "提交时间",
    "今日菜单",
    "饮品",
    "甜品",
    "备注",
    "附加服务",
    "甜甜的话",
    "完整订单"
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }

  var data = {};
  try {
    data = JSON.parse(e.postData.contents || "{}");
  } catch (error) {
    data = e.parameter || {};
  }

  sheet.appendRow([
    data.submittedAt || new Date(),
    data.main || "",
    data.drink || "",
    data.dessert || "",
    data.needs || "",
    data.service || "",
    data.loveLine || "",
    data.orderText || ""
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

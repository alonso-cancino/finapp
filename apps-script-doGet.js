/**
 * Full Google Apps Script for Family Expense Tracker.
 * Paste this entire file into your Apps Script editor and redeploy.
 *
 * Requires a "Members" sheet tab — it will be created automatically on first use.
 */

const SHEET_ID = "1fhwQobXHt-t5P_0xvUdwfGVjP4AgYsbRWF-sPUVHiwk";

function getMembersSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName("Members");
  if (!sheet) {
    sheet = ss.insertSheet("Members");
    sheet.getRange("A1").setValue("Name");
  }
  return sheet;
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  // Save members
  if (data.action === "setMembers") {
    var sheet = getMembersSheet();
    sheet.clear();
    sheet.getRange("A1").setValue("Name");
    var members = data.members || [];
    for (var i = 0; i < members.length; i++) {
      sheet.getRange(i + 2, 1).setValue(members[i]);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Log expense
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  sheet.appendRow([
    new Date(),
    data.date,
    data.who,
    Number(data.amount),
    data.category,
    data.description || "",
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  // Return members list
  if (e.parameter.action === "getMembers") {
    var sheet = getMembersSheet();
    var data = sheet.getDataRange().getValues();
    var members = [];
    for (var i = 1; i < data.length; i++) {
      if (data[i][0]) members.push(data[i][0]);
    }
    return ContentService
      .createTextOutput(JSON.stringify({ members: members }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Dashboard data
  var month = e.parameter.month;
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  var data = sheet.getDataRange().getValues();

  var summary = {};
  var byCategory = {};
  var byCategoryPerPerson = {};
  var expenses = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rowDate = String(row[1]).slice(0, 7);
    if (rowDate !== month) continue;

    var who = row[2];
    var amount = Number(row[3]);
    var category = row[4];
    var description = row[5] || "";

    summary[who] = (summary[who] || 0) + amount;
    byCategory[category] = (byCategory[category] || 0) + amount;
    if (!byCategoryPerPerson[who]) byCategoryPerPerson[who] = {};
    byCategoryPerPerson[who][category] = (byCategoryPerPerson[who][category] || 0) + amount;

    expenses.push({
      date: String(row[1]).slice(0, 10),
      who: who,
      amount: amount,
      category: category,
      description: description,
    });
  }

  expenses.reverse();
  expenses = expenses.slice(0, 20);

  return ContentService
    .createTextOutput(JSON.stringify({
      summary: summary,
      byCategory: byCategory,
      byCategoryPerPerson: byCategoryPerPerson,
      expenses: expenses,
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

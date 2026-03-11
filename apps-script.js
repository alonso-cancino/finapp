/**
 * Google Apps Script for Family Expense Tracker.
 * Paste this entire file into your Apps Script editor and deploy as Web App.
 *
 * Setup:
 * 1. Replace SHEET_ID with your Google Sheet ID (from the spreadsheet URL)
 * 2. Set SECRET_TOKEN to a random string (this is the password your family will use)
 * 3. Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone
 * 4. A "Members" sheet tab will be created automatically on first use.
 */

const SHEET_ID = "YOUR_GOOGLE_SHEET_ID";
const SECRET_TOKEN = ""; // Set this to a random string to protect your data

function checkToken(e) {
  if (!SECRET_TOKEN) return null;
  if (e.parameter && e.parameter.token === SECRET_TOKEN) return null;
  return ContentService
    .createTextOutput(JSON.stringify({ error: "Unauthorized" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function formatDate(val) {
  if (Object.prototype.toString.call(val) === "[object Date]") {
    var y = val.getFullYear();
    var m = ("0" + (val.getMonth() + 1)).slice(-2);
    var d = ("0" + val.getDate()).slice(-2);
    return y + "-" + m + "-" + d;
  }
  return String(val);
}

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
  var authError = checkToken(e);
  if (authError) return authError;

  var data = JSON.parse(e.postData.contents);

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
  var authError = checkToken(e);
  if (authError) return authError;

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

  var month = e.parameter.month;
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  var data = sheet.getDataRange().getValues();
  var summary = {};
  var byCategory = {};
  var byCategoryPerPerson = {};
  var expenses = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var dateStr = formatDate(row[1]);
    var rowMonth = dateStr.slice(0, 7);
    if (rowMonth !== month) continue;

    var who = row[2];
    var amount = Number(row[3]);
    var category = row[4];
    var description = row[5] || "";

    summary[who] = (summary[who] || 0) + amount;
    byCategory[category] = (byCategory[category] || 0) + amount;
    if (!byCategoryPerPerson[who]) byCategoryPerPerson[who] = {};
    byCategoryPerPerson[who][category] = (byCategoryPerPerson[who][category] || 0) + amount;
    expenses.push({ date: dateStr.slice(0, 10), who: who, amount: amount, category: category, description: description });
  }

  expenses.reverse();
  expenses = expenses.slice(0, 20);

  return ContentService
    .createTextOutput(JSON.stringify({ summary: summary, byCategory: byCategory, byCategoryPerPerson: byCategoryPerPerson, expenses: expenses }))
    .setMimeType(ContentService.MimeType.JSON);
}

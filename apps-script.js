/**
 * Google Apps Script for Family Finance Tracker.
 * Paste this entire file into your Apps Script editor and deploy as Web App.
 *
 * Setup:
 * 1. Replace SHEET_ID with your Google Sheet ID (from the spreadsheet URL)
 * 2. Set SECRET_TOKEN to a random string (this is the password your family will use)
 * 3. Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone
 * 4. A "Members" sheet tab will be created automatically on first use.
 *
 * Schema (9 columns):
 * Timestamp | Date | Type | Who | Amount | Category | Shared | To | Description
 */

const SHEET_ID = "YOUR_GOOGLE_SHEET_ID";
const SECRET_TOKEN = ""; // Set this to a random string to protect your data
const DATA_SHEET_NAME = "Movements";
const NEW_HEADERS = ["Timestamp", "Date", "Type", "Who", "Amount", "Category", "Shared", "To", "Description"];

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

function getDataSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(DATA_SHEET_NAME);
  if (!sheet) {
    // Fall back to first sheet if named sheet doesn't exist yet
    sheet = ss.getSheets()[0];
  }
  return sheet;
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

function ensureHeaders(sheet) {
  var firstRow = sheet.getRange(1, 1, 1, 9).getValues()[0];
  if (firstRow[0] !== NEW_HEADERS[0] || firstRow[2] !== NEW_HEADERS[2]) {
    sheet.getRange(1, 1, 1, 9).setValues([NEW_HEADERS]);
  }
}

/**
 * One-time migration from old 6-column schema to new 9-column schema.
 * Run manually from Apps Script editor, then remove.
 *
 * Old: [Timestamp, Date, Who, Amount, Category, Description]
 * New: [Timestamp, Date, Type, Who, Amount, Category, Shared, To, Description]
 */
function migrateToNewSchema() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();

  if (data.length === 0) return;

  // Check if already migrated (header has 9+ cols and Type in col 3)
  if (data[0].length >= 9 && data[0][2] === "Type") {
    Logger.log("Already migrated.");
    return;
  }

  var newData = [];
  // New header
  newData.push(NEW_HEADERS);

  // Transform data rows
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    // Old: [Timestamp, Date, Who, Amount, Category, Description]
    // New: [Timestamp, Date, "expense", Who, Amount, Category, "shared", "", Description]
    newData.push([
      row[0],           // Timestamp
      row[1],           // Date
      "expense",        // Type (default)
      row[2],           // Who
      row[3],           // Amount
      row[4],           // Category
      "shared",         // Shared (default for old expenses)
      "",               // To (empty)
      row[5] || ""      // Description
    ]);
  }

  // Clear and rewrite
  sheet.clear();
  if (newData.length > 0) {
    sheet.getRange(1, 1, newData.length, 9).setValues(newData);
  }

  // Rename sheet
  sheet.setName(DATA_SHEET_NAME);
  Logger.log("Migration complete. " + (newData.length - 1) + " rows migrated.");
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

  var sheet = getDataSheet();
  ensureHeaders(sheet);

  var type = data.type || "expense";
  var shared = data.shared || "shared";
  var to = data.to || "";
  var category = data.category || "";

  sheet.appendRow([
    new Date(),
    data.date,
    type,
    data.who,
    Number(data.amount),
    category,
    type === "expense" ? shared : "",
    type === "transfer" ? to : "",
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
  var sheet = getDataSheet();
  ensureHeaders(sheet);
  var data = sheet.getDataRange().getValues();

  // Aggregation buckets
  var summary = {};          // shared expenses per person
  var byCategory = {};       // shared expenses by category
  var byCategoryPerPerson = {}; // shared expenses by person by category
  var income = {};           // total income per person
  var personalExpenses = {}; // total personal expenses per person
  var savings = {};          // net savings per person (savings - withdrawals)
  var transfers = {};        // net transfers per person (received - sent)
  var expenses = [];         // all movements for the month

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var dateStr = formatDate(row[1]);
    var rowMonth = dateStr.slice(0, 7);
    if (rowMonth !== month) continue;

    var type = row[2] || "expense";
    var who = row[3];
    var amount = Number(row[4]);
    var category = row[5] || "";
    var shared = row[6] || "";
    var to = row[7] || "";
    var description = row[8] || "";

    expenses.push({
      date: dateStr.slice(0, 10),
      type: type,
      who: who,
      amount: amount,
      category: category,
      shared: shared,
      to: to,
      description: description
    });

    if (type === "expense") {
      if (shared === "personal") {
        personalExpenses[who] = (personalExpenses[who] || 0) + amount;
      } else {
        // shared expense (default)
        summary[who] = (summary[who] || 0) + amount;
        byCategory[category] = (byCategory[category] || 0) + amount;
        if (!byCategoryPerPerson[who]) byCategoryPerPerson[who] = {};
        byCategoryPerPerson[who][category] = (byCategoryPerPerson[who][category] || 0) + amount;
      }
    } else if (type === "income") {
      income[who] = (income[who] || 0) + amount;
    } else if (type === "savings") {
      savings[who] = (savings[who] || 0) + amount;
    } else if (type === "withdrawal") {
      savings[who] = (savings[who] || 0) - amount;
    } else if (type === "transfer") {
      transfers[who] = (transfers[who] || 0) - amount;
      if (to) {
        transfers[to] = (transfers[to] || 0) + amount;
      }
    }
  }

  // Fairness calculation
  var totalIncome = 0;
  var totalShared = 0;
  var fairness = {};

  for (var key in income) {
    totalIncome += income[key];
  }
  for (var key in summary) {
    totalShared += summary[key];
  }

  // Get all people who either earned income or paid shared expenses
  var allPeople = {};
  for (var key in income) allPeople[key] = true;
  for (var key in summary) allPeople[key] = true;
  var peopleList = Object.keys(allPeople);

  if (peopleList.length > 0) {
    for (var p = 0; p < peopleList.length; p++) {
      var person = peopleList[p];
      var actualPaid = summary[person] || 0;
      var shouldPay;
      if (totalIncome > 0) {
        shouldPay = ((income[person] || 0) / totalIncome) * totalShared;
      } else {
        // Equal split fallback
        shouldPay = totalShared / peopleList.length;
      }
      fairness[person] = {
        actualPaid: actualPaid,
        shouldPay: Math.round(shouldPay),
        balance: Math.round(actualPaid - shouldPay)
      };
    }
  }

  expenses.reverse();
  expenses = expenses.slice(0, 20);

  return ContentService
    .createTextOutput(JSON.stringify({
      summary: summary,
      byCategory: byCategory,
      byCategoryPerPerson: byCategoryPerPerson,
      income: income,
      personalExpenses: personalExpenses,
      savings: savings,
      transfers: transfers,
      fairness: fairness,
      expenses: expenses
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

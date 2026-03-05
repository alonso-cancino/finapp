/**
 * Add this function to your existing Google Apps Script (alongside doPost).
 * After adding, re-deploy the Web App as a NEW version.
 *
 * Usage: GET https://script.google.com/.../exec?month=2026-03
 * Returns JSON with summary, byCategory, byCategoryPerPerson, and recent expenses.
 */
function doGet(e) {
  var month = e.parameter.month; // "YYYY-MM"
  var sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  var data = sheet.getDataRange().getValues();

  var summary = {};
  var byCategory = {};
  var byCategoryPerPerson = {};
  var expenses = [];

  // Skip header row (row 0)
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    // Columns: A=ServerTimestamp, B=Date, C=Who, D=Amount, E=Category, F=Description
    var rowDate = String(row[1]).slice(0, 7); // "YYYY-MM"
    if (rowDate !== month) continue;

    var who = row[2];
    var amount = Number(row[3]);
    var category = row[4];
    var description = row[5] || "";

    // Summary per person
    summary[who] = (summary[who] || 0) + amount;

    // By category (all)
    byCategory[category] = (byCategory[category] || 0) + amount;

    // By category per person
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

  // Return last 20 expenses, most recent first
  expenses.reverse();
  expenses = expenses.slice(0, 20);

  var result = {
    summary: summary,
    byCategory: byCategory,
    byCategoryPerPerson: byCategoryPerPerson,
    expenses: expenses,
  };

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

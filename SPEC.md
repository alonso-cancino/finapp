# Family Expense Tracker — PWA Spec

## Overview

A mobile-first PWA that lets family members log expenses from their phone. Each submission is POSTed to a Google Apps Script endpoint which appends a row to a shared Google Sheet.

---

## Tech Stack

- **Frontend:** React + Vite (single page, no router needed)
- **Styling:** Tailwind CSS
- **PWA:** `vite-plugin-pwa` (generates manifest + service worker)
- **Hosting:** GitHub Pages or Vercel (static)
- **Backend:** Google Apps Script (no server, lives in Google Drive)

---

## App Structure

```
/
├── public/
│   └── icons/          # App icons (192x192, 512x512)
├── src/
│   ├── App.jsx          # Main component (single view)
│   ├── main.jsx
│   └── config.js        # SCRIPT_URL + family members list
├── index.html
├── vite.config.js       # includes PWA plugin config
└── .env                 # VITE_SCRIPT_URL=https://script.google.com/...
```

---

## config.js

```js
export const FAMILY_MEMBERS = ["Alonso", "Partner"]; // edit as needed

export const CATEGORIES = [
  "Food",
  "Transport",
  "Supermarket",
  "Health",
  "Entertainment",
  "Home",
  "Other",
];

export const SCRIPT_URL = import.meta.env.VITE_SCRIPT_URL;
```

---

## Form Fields

| Field | Type | Notes |
|---|---|---|
| `who` | dropdown | from `FAMILY_MEMBERS` |
| `amount` | number input | positive, 2 decimal places |
| `category` | dropdown | from `CATEGORIES` |
| `description` | text input | optional |
| `date` | date picker | defaults to today |

---

## Submission

On submit, POST to `SCRIPT_URL` as JSON:

```js
fetch(SCRIPT_URL, {
  method: "POST",
  body: JSON.stringify({ who, amount, category, description, date }),
});
```

> Google Apps Script requires `mode: "no-cors"` — this means you won't get a meaningful response back. Handle it optimistically (show success, catch network errors).

```js
fetch(SCRIPT_URL, {
  method: "POST",
  mode: "no-cors",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});
```

Show a success toast on submission. Reset the form except for `who` (user likely logs multiple in a row).

---

## UX Notes

- Large tap targets (mobile-first)
- Amount field should open numeric keyboard (`inputMode="decimal"`)
- Disable submit button while loading
- Show a subtle recent submissions list (last 3, stored in `localStorage`) so users can confirm their entry landed

---

## PWA Manifest (via vite-plugin-pwa)

```js
// vite.config.js
VitePWA({
  registerType: "autoUpdate",
  manifest: {
    name: "Family Expenses",
    short_name: "Expenses",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    icons: [
      { src: "/icons/192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/512.png", sizes: "512x512", type: "image/png" },
    ],
  },
})
```

---

## Google Apps Script (backend)

Create a new Apps Script file at [script.google.com](https://script.google.com), paste this, deploy as **Web App** (execute as yourself, access to anyone):

```js
const SHEET_ID = "YOUR_GOOGLE_SHEET_ID";

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

  sheet.appendRow([
    new Date(),          // server timestamp
    data.date,           // client date
    data.who,
    Number(data.amount),
    data.category,
    data.description || "",
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

After deploying, copy the Web App URL into your `.env` as `VITE_SCRIPT_URL`.

---

## Google Sheet Structure

The script will append rows with these columns (add headers manually on row 1):

| A | B | C | D | E | F |
|---|---|---|---|---|---|
| Server Timestamp | Date | Who | Amount | Category | Description |

You can add summary sheets, pivot tables, charts on top of this freely.

---

## Deployment (GitHub Pages)

```bash
npm run build
# add to vite.config.js: base: "/your-repo-name/"
# push to GitHub, enable Pages from /dist branch
```

Or just drag the `dist/` folder to [vercel.com](https://vercel.com) — zero config needed.
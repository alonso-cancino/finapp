# Gastos Familiares

A simple family expense tracker PWA. Log expenses, see monthly breakdowns by person and category. Backed by Google Sheets via Apps Script.

## Fork & Deploy

1. **Create a Google Sheet** — open [sheets.google.com](https://sheets.google.com) and create a blank spreadsheet. Copy its ID from the URL (`/d/SHEET_ID/edit`).

2. **Set up Apps Script** — open [script.google.com](https://script.google.com), create a new project, and paste the contents of `apps-script.js`. Update:
   - `SHEET_ID` — your spreadsheet ID
   - `SECRET_TOKEN` — a random string (this is the password your family will enter in the app)

   Deploy: **Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone**. Copy the deployment URL.

3. **Fork this repo** and add a GitHub secret:
   - `VITE_SCRIPT_URL` — the Apps Script deployment URL from step 2

4. **Enable GitHub Pages** — go to Settings > Pages > Source: GitHub Actions.

5. Push to `main` (or run the workflow manually) — the app will deploy automatically. The base path is auto-detected from your repo name.

6. **Share the password** (`SECRET_TOKEN`) with your family. Each device enters it once on first launch.

## Local Development

```bash
cp .env.example .env
# Edit .env with your Apps Script URL
npm install
npm run dev
```

## How Auth Works

- The owner sets `SECRET_TOKEN` in Apps Script to a random string
- The frontend shows a password screen on first launch
- The password is validated via a test API call
- If correct, it's saved to localStorage and never asked again
- Settings > "Cerrar sesion" clears the saved password
- If `SECRET_TOKEN` is left empty, no auth is required (not recommended for public repos)

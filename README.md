# Gastos Familiares

A family expense tracker PWA. Log expenses from your phone, see monthly breakdowns by person and category. Data is stored in Google Sheets, served via Apps Script, and the frontend is deployed on GitHub Pages.

## How It Works

```
Phone (PWA)  -->  GitHub Pages (static frontend)  -->  Apps Script (API)  -->  Google Sheets (data)
```

- The frontend is a static React app hosted on GitHub Pages
- All data reads/writes go through a Google Apps Script web app
- The Apps Script reads from and writes to a Google Sheet you own
- A password (`SECRET_TOKEN`) protects the API so only your family can access it

## Fork & Deploy (Step by Step)

### 1. Create a Google Sheet

Go to [sheets.google.com](https://sheets.google.com) and create a blank spreadsheet. Copy the Sheet ID from the URL:

```
https://docs.google.com/spreadsheets/d/THIS_IS_YOUR_SHEET_ID/edit
```

### 2. Set up Apps Script

Go to [script.google.com](https://script.google.com) and create a new project. You don't need to paste code manually — we'll push it from the terminal (see step 5). For now, just get your **Script ID**:

- Open the project > **Project Settings** (gear icon) > copy the **Script ID**

### 3. Fork this repo

Fork it on GitHub, then clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/finapp.git
cd finapp
npm install
```

### 4. Configure your environment

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
VITE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
SHEET_ID=YOUR_GOOGLE_SHEET_ID
SECRET_TOKEN=a_password_for_your_family
```

- `SHEET_ID` — from step 1
- `SECRET_TOKEN` — any string you choose; this is the password your family will type once on each device
- `VITE_SCRIPT_URL` — you'll get this after deploying the Apps Script in step 5 (come back and fill it in)

Also create `.clasp.json`:

```bash
cp .clasp.json.example .clasp.json
```

Edit it with your Script ID from step 2.

### 5. Deploy the Apps Script

Log in to Google (one-time):

```bash
npx @google/clasp login
```

Push the code and deploy:

```bash
npm run deploy:gas
npx @google/clasp deploy --description "v1"
```

The deploy command outputs your **deployment URL** — copy it and paste it as `VITE_SCRIPT_URL` in your `.env` file.

**Important:** Each time you run `npx @google/clasp deploy`, it creates a new deployment with a new URL. To update an existing deployment instead:

```bash
npx @google/clasp deployments          # list deployments, copy the ID
npx @google/clasp deploy -i DEPLOY_ID  # update that deployment
```

### 6. Deploy the frontend

Add a GitHub secret in your fork (Settings > Secrets > Actions):

- `VITE_SCRIPT_URL` — the Apps Script deployment URL from step 5

Enable GitHub Pages: **Settings > Pages > Source: GitHub Actions**.

Push to `main` — the app will build and deploy automatically. The base path is auto-detected from your repo name.

### 7. Share with your family

Open the GitHub Pages URL on your phone and install as a PWA (Share > Add to Home Screen). Enter the password you set as `SECRET_TOKEN`. Each device only needs to enter it once.

## Local Development

```bash
cp .env.example .env
# Fill in your values
npm install
npm run dev
```

The app runs at `http://localhost:5173`. You'll see the password screen — enter your `SECRET_TOKEN` value.

## Updating the Apps Script

Whenever you change `apps-script.js`, push the update:

```bash
npm run deploy:gas
```

This reads `SHEET_ID` and `SECRET_TOKEN` from your `.env`, injects them into the code, and pushes to Google. No need to open the browser.

To change the password: update `SECRET_TOKEN` in `.env`, run `npm run deploy:gas`, and tell your family the new password. They can enter it after using Settings > "Cerrar sesion" on their devices.

## Auth Flow

1. User opens the app for the first time
2. Sees a password screen: "Ingresa la contrasena"
3. Enters the password the owner shared with them
4. App validates via a test API call — if wrong, shows error; if correct, saves to localStorage
5. App loads normally; password is never asked again
6. To log out or change password: Settings > "Cerrar sesion"

If `SECRET_TOKEN` is left empty in the Apps Script, no auth is required — **not recommended** if your repo is public, since anyone could find your API URL and read/write your data.

## Project Structure

```
├── src/
│   ├── App.jsx                  # Main app with auth gate
│   ├── config.js                # API helpers, token management
│   ├── components/
│   │   ├── TokenGate.jsx        # Password entry screen
│   │   ├── ExpenseForm.jsx      # Log an expense
│   │   ├── Dashboard.jsx        # Monthly summary charts
│   │   ├── Settings.jsx         # Manage family members + logout
│   │   ├── BottomNav.jsx        # Tab navigation
│   │   └── ...
│   └── hooks/
│       ├── useExpenseForm.js    # Form state + API submission
│       └── useDashboardData.js  # Fetch monthly data
├── apps-script.js               # Google Apps Script backend (source)
├── gas/                         # Generated files pushed to Apps Script
├── scripts/
│   └── deploy-gas.js            # Injects .env values + runs clasp push
├── .env.example                 # Template for local config
├── .clasp.json.example          # Template for clasp config
└── vite.config.js               # Dynamic base path
```

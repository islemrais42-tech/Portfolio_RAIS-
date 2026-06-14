# Islem Rais — Portfolio Setup Guide

## Project Structure

```
Portfolio/
├── public/                    ← Your website (open index.html in browser)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── google-apps-script/
│   └── Code.gs                ← Paste this into Google Apps Script
└── README.md                  ← This file
```

---

## Step 1 — Create Your Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) and create a **new blank spreadsheet**
2. Name it: **"Portfolio Contacts"** (or anything you like)
3. The script will automatically create a **"Contacts"** tab with headers when the first message arrives

---

## Step 2 — Set Up Google Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. Delete all existing code in the editor
3. Open the file `google-apps-script/Code.gs` from this folder
4. **Copy and paste** the entire contents into the Apps Script editor
5. *(Optional)* Set your email in line 18 to receive notifications:
   ```javascript
   const NOTIFY_EMAIL = 'your.email@gmail.com';
   ```
6. Click **Save** (Ctrl+S)

---

## Step 3 — Deploy as Web App

1. Click **Deploy → New deployment**
2. Click the gear icon ⚙️ next to "Select type" → choose **Web App**
3. Fill in:
   - **Description**: Portfolio Contact Form
   - **Execute as**: Me
   - **Who has access**: Anyone
4. Click **Deploy**
5. **Authorize** the app when prompted (click "Allow")
6. **Copy the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/XXXXXXXXXXXXXX/exec
   ```

---

## Step 4 — Connect to Your Portfolio

1. Open `public/script.js`
2. Find this line near the bottom:
   ```javascript
   const APPS_SCRIPT_URL = 'YOUR_APPS_SCRIPT_URL_HERE';
   ```
3. Replace `'YOUR_APPS_SCRIPT_URL_HERE'` with your copied URL:
   ```javascript
   const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/XXXXXXXXXXXXXX/exec';
   ```
4. Save the file

---

## Step 5 — Test It

1. Open `public/index.html` in your browser
2. Scroll to the Contact section
3. Fill in the form and click **Send Message**
4. Check your Google Sheet — a new row should appear in the **Contacts** tab

---

## What Gets Saved to Google Sheets

Each form submission creates a row with:

| Timestamp | Name | Email | Subject | Message |
|-----------|------|-------|---------|---------|
| 14/06/2026, 14:30 | John Smith | john@co.com | Partnership | Hello... |

---

## Customise Your Info

Open `public/index.html` and update the placeholder text:

| Placeholder | Replace with |
|-------------|-------------|
| `your.email@example.com` | Your real email address |
| `Company Name` | Your actual employer names |
| `University Name` | Your university |
| `20XX — 20XX` | Your actual years |
| `$X million` | Your real account value |

---

## Hosting (Optional — To Share Online)

To make your portfolio accessible online for free:

### Option A — GitHub Pages (recommended)
1. Create a free [GitHub](https://github.com) account
2. Create a new repository
3. Upload all files from the `public/` folder
4. Go to Settings → Pages → Branch: main → Save
5. Your site is live at `https://yourusername.github.io/repo-name`

### Option B — Netlify (drag & drop)
1. Go to [netlify.com](https://netlify.com)
2. Drag the entire `public/` folder onto the deploy area
3. Done — live URL in seconds

---

## Troubleshooting

**Form submits but nothing appears in Google Sheets:**
- Make sure you redeployed after any code change (Deploy → Manage deployments → Edit → New version)
- Check that "Who has access" is set to **Anyone**

**"Something went wrong" error:**
- Verify your Apps Script URL is correctly pasted in `script.js`
- Make sure you authorized the Apps Script when deploying

**Need to update the Apps Script:**
- Edit the code in Apps Script editor
- Click Deploy → Manage deployments → Edit → select "New version" → Deploy

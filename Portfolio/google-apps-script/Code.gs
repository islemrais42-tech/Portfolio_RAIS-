/**
 * =====================================================
 *  ISLEM RAIS PORTFOLIO — Google Apps Script Backend
 *  Receives contact form submissions → writes to Google Sheets
 * =====================================================
 *
 *  SETUP STEPS (see README.md for screenshots guide):
 *  1. Open Google Sheets → create a new sheet named "Contacts"
 *  2. In Google Sheets: Extensions → Apps Script → paste this code
 *  3. Click "Deploy" → "New deployment" → "Web App"
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  4. Copy the Web App URL → paste into script.js (APPS_SCRIPT_URL)
 * =====================================================
 */

// ── CONFIG ──────────────────────────────────────────
const SHEET_NAME    = 'Contacts';      // Tab name in your Google Sheet
const NOTIFY_EMAIL  = '';              // Optional: your email for notifications (or leave empty)
// ────────────────────────────────────────────────────

/**
 * Handles POST requests from the portfolio contact form.
 */
function doPost(e) {
  try {
    // Parse incoming JSON
    const data = JSON.parse(e.postData.contents);

    const name      = sanitize(data.name      || '');
    const email     = sanitize(data.email     || '');
    const subject   = sanitize(data.subject   || '(No subject)');
    const message   = sanitize(data.message   || '');
    const timestamp = data.timestamp || new Date().toLocaleString('fr-DZ');

    // Write to Google Sheet
    const sheet = getOrCreateSheet();
    sheet.appendRow([timestamp, name, email, subject, message]);

    // Optional email notification
    if (NOTIFY_EMAIL) {
      sendNotificationEmail({ name, email, subject, message, timestamp });
    }

    return buildResponse({ status: 'success', message: 'Submission saved.' });

  } catch (err) {
    return buildResponse({ status: 'error', message: err.message }, 500);
  }
}

/**
 * Handles GET requests (used for testing the endpoint is live).
 */
function doGet() {
  return buildResponse({ status: 'ok', message: 'Portfolio API is running.' });
}

// ── HELPERS ─────────────────────────────────────────

/**
 * Gets the "Contacts" sheet, or creates it with headers if it doesn't exist.
 */
function getOrCreateSheet() {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let sheet   = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add headers in row 1
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message']);

    // Style headers
    const headerRange = sheet.getRange(1, 1, 1, 5);
    headerRange.setBackground('#0a0a0f');
    headerRange.setFontColor('#c9a84c');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(11);

    // Freeze header row
    sheet.setFrozenRows(1);

    // Set column widths
    sheet.setColumnWidth(1, 160); // Timestamp
    sheet.setColumnWidth(2, 160); // Name
    sheet.setColumnWidth(3, 200); // Email
    sheet.setColumnWidth(4, 200); // Subject
    sheet.setColumnWidth(5, 400); // Message
  }

  return sheet;
}

/**
 * Sends an email notification when a new message arrives.
 */
function sendNotificationEmail(data) {
  const subject = `📬 New message from ${data.name} — Portfolio`;
  const body = `
New contact form submission on your portfolio:

━━━━━━━━━━━━━━━━━━━━━━━━━
  Time:     ${data.timestamp}
  Name:     ${data.name}
  Email:    ${data.email}
  Subject:  ${data.subject}
━━━━━━━━━━━━━━━━━━━━━━━━━

Message:
${data.message}

━━━━━━━━━━━━━━━━━━━━━━━━━
Reply directly to: ${data.email}
`;
  MailApp.sendEmail({
    to:      NOTIFY_EMAIL,
    subject: subject,
    body:    body,
    replyTo: data.email
  });
}

/**
 * Strips potentially dangerous characters from input.
 */
function sanitize(str) {
  return String(str)
    .replace(/[<>]/g, '')     // remove HTML tags
    .substring(0, 2000)       // cap length
    .trim();
}

/**
 * Returns a JSON ContentService response.
 */
function buildResponse(data, code) {
  const output = ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
  return output;
}

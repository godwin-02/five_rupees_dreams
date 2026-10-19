# Five Rupees Dreams — Contact Form Setup

## Why was the form returning 405?

The form sends a `POST /api/contact` request. When you open `index.html`
directly in a browser (double-click or Live Server), there is no server
handling that route — the browser returns 405 (Method Not Allowed).

**The fix:** The contact form now has two delivery tiers:

| Tier | How | When |
|------|-----|------|
| **1 — Node backend** | `POST /api/contact` via `server.js` | When you run `npm start` |
| **2 — FormSubmit.co** | Direct HTTPS to FormSubmit's API | Automatic fallback if Tier 1 fails |

**The form works right now** — FormSubmit kicks in automatically if the
Node server isn't running. No setup needed for the fallback.

---

## Option A — Works immediately (no setup)

Just open the website. FormSubmit delivers messages to
`soundarfrancis@gmail.com` automatically.

> **First-time only:** FormSubmit will send a confirmation email to
> `soundarfrancis@gmail.com` the very first time a message is submitted.
> Francis must click the confirm link in that email to activate delivery.
> After that, all messages arrive normally.

---

## Option B — Full Node backend (recommended for production)

This uses your own Gmail account and gives you full control.

### Step 1 — Create a Gmail App Password

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** if not already on
3. Go to **Security → 2-Step Verification → App passwords**
4. Click **Create**, choose **Mail** + **Other (custom name)** → name it "FiveRupees"
5. Copy the **16-character code** shown (e.g. `abcd efgh ijkl mnop`)

### Step 2 — Edit `.env`

Open `.env` in the project root and fill in:

```
SMTP_USER=the-gmail-you-control@gmail.com
SMTP_PASS=abcdefghijklmnop
```

> Use the Gmail that will **send** the emails (can be any Gmail you own).
> Messages will still be **delivered to** `soundarfrancis@gmail.com`.

### Step 3 — Start the server

```bash
npm start
```

### Step 4 — Open the website via the server

```
http://localhost:3001
```

> **Important:** You must open `http://localhost:3001` — NOT by
> double-clicking `index.html`. The backend only handles requests
> coming from the same origin.

---

## Deployment (going live)

When hosting online, any of these platforms work:

| Platform | How |
|----------|-----|
| **Railway** | Connect repo → set env vars → deploy |
| **Render** | Web Service → `npm start` → set env vars |
| **Heroku** | `git push heroku main` → set config vars |
| **VPS/cPanel** | Upload files → run `npm start` with PM2 |

Set these environment variables on your host:
```
SMTP_USER=your-sending-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
RECIPIENT_EMAIL=soundarfrancis@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
```

Then in `script.js`, update the `BACKEND_URL`:
```js
const BACKEND_URL = 'https://your-deployed-app.railway.app/api/contact';
```

---

## Quick test (no form needed)

Once the server is running, test the endpoint directly:

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Hello from curl test"}'
```

Expected response:
```json
{"success": true, "message": "Message delivered successfully."}
```

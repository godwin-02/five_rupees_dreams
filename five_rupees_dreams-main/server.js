'use strict';

require('dotenv').config();
const express    = require('express');
const path       = require('path');
const cors       = require('cors');
const nodemailer = require('nodemailer');
const rateLimit  = require('express-rate-limit');
const validator  = require('validator');

const app  = express();
const PORT = process.env.PORT || 3001;

// ── Serve static frontend files ───────────────────────────────────────────────
// This makes the server serve index.html, style.css, script.js and images
// from the same process — so /api/contact works as a relative URL.
app.use(express.static(path.join(__dirname), {
  index: 'index.html',
  // Don't expose server source files
  dotfiles: 'deny',
}));

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// CORS — allow same-origin and any configured origins
const ALLOWED = (process.env.ALLOWED_ORIGINS || '')
  .split(',').map(s => s.trim()).filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (same-origin, curl, Postman)
    if (!origin || ALLOWED.length === 0 || ALLOWED.includes(origin)) {
      return cb(null, true);
    }
    cb(new Error('CORS policy: origin not allowed — ' + origin));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// ── Rate limiting — 5 form submissions per IP per 15 min ─────────────────────
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many messages sent. Please wait 15 minutes before trying again.',
  },
  handler: (req, res, next, options) => {
    console.warn('[RateLimit] IP blocked:', req.ip);
    res.status(429).json(options.message);
  },
});

// ── Nodemailer transporter factory ───────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true', // true = port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 12000,
    greetingTimeout:   8000,
    socketTimeout:     12000,
    logger: false,
    debug:  false,
  });
}

// ── POST /api/contact ─────────────────────────────────────────────────────────
app.post('/api/contact', contactLimiter, async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  console.log('[Contact] Incoming request | IP:', ip);

  try {
    const { name, email, message } = req.body;

    // ── Input validation ──────────────────────────────────────────────────────
    if (!name || typeof name !== 'string' ||
        name.trim().length < 2 || name.trim().length > 100) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid name (2–100 characters).',
      });
    }

    if (!email || !validator.isEmail(String(email).trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (!message || typeof message !== 'string' ||
        message.trim().length < 10 || message.trim().length > 3000) {
      return res.status(400).json({
        success: false,
        message: 'Message must be between 10 and 3000 characters.',
      });
    }

    // ── Sanitise ──────────────────────────────────────────────────────────────
    const safeName    = validator.escape(name.trim());
    const safeMessage = validator.escape(message.trim());
    const safeEmail   = validator.normalizeEmail(email.trim()) || email.trim().toLowerCase();

    const TO = process.env.RECIPIENT_EMAIL || 'soundarfrancis@gmail.com';

    console.log('[Contact] Sending to:', TO, '| Sender:', safeEmail);

    // ── Send ──────────────────────────────────────────────────────────────────
    const transporter = createTransporter();

    // Verify SMTP credentials before attempting send
    await transporter.verify();
    console.log('[Contact] SMTP connection verified.');

    const info = await transporter.sendMail({
      from:    `"Five Rupees Dreams Website" <${process.env.SMTP_USER}>`,
      to:      TO,
      replyTo: safeEmail,
      subject: `New message from ${safeName} — Five Rupees Dreams`,

      // Plain-text fallback
      text: [
        'You have received a new message from your website.',
        '',
        'Name:    ' + safeName,
        'Email:   ' + safeEmail,
        '',
        'Message:',
        '-'.repeat(60),
        safeMessage,
        '-'.repeat(60),
        '',
        'Reply to this email to respond directly to the sender.',
      ].join('\n'),

      // HTML version
      html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e5e7eb;max-width:100%">
        <!-- Header -->
        <tr><td style="background:#111622;padding:28px 36px">
          <h1 style="color:#D4AF37;margin:0;font-size:22px;font-weight:400;letter-spacing:0.05em">The Five Rupees Dreams</h1>
          <p  style="color:#94A3B8;margin:6px 0 0;font-size:13px">New Contact Message</p>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:36px">
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:28px">
            <tr>
              <td style="padding:10px 0;color:#64748B;font-size:13px;width:80px;vertical-align:top">Name</td>
              <td style="padding:10px 0;color:#111622;font-weight:600;font-size:15px">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#64748B;font-size:13px;vertical-align:top">Email</td>
              <td style="padding:10px 0;font-size:15px">
                <a href="mailto:${safeEmail}" style="color:#D4AF37;text-decoration:none">${safeEmail}</a>
              </td>
            </tr>
          </table>
          <div style="background:#F8FAFC;border-left:3px solid #D4AF37;padding:20px 24px;border-radius:0 6px 6px 0">
            <p style="margin:0;color:#374151;font-size:15px;line-height:1.75;white-space:pre-line">${safeMessage}</p>
          </div>
          <p style="margin:28px 0 0;font-size:13px;color:#94A3B8">
            Hit <strong>Reply</strong> to respond directly to ${safeName}.
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#F8FAFC;padding:18px 36px;text-align:center;border-top:1px solid #e5e7eb">
          <p style="margin:0;color:#94A3B8;font-size:12px">
            Sent via Five Rupees Dreams website &bull; fiverupeesdreams.com
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    });

    console.log('[Contact] Delivered. MessageId:', info.messageId);
    return res.status(200).json({ success: true, message: 'Message delivered successfully.' });

  } catch (err) {
    console.error('[Contact] Error:', err.code || '', err.message);

    if (err.code === 'EAUTH') {
      console.error('[Contact] Auth failed — verify SMTP_USER and SMTP_PASS in .env');
      return res.status(500).json({
        success: false,
        message: 'Server mail configuration error. Please email directly: soundarfrancis@gmail.com',
      });
    }

    if (err.code === 'ETIMEDOUT' || err.code === 'ECONNECTION' || err.code === 'ECONNREFUSED') {
      return res.status(503).json({
        success: false,
        message: 'Mail server temporarily unavailable. Please try again shortly.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Could not send message. Please email directly: soundarfrancis@gmail.com',
    });
  }
});

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', ts: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found.' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[Server]', err.message);
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════════╗');
  console.log('║       Five Rupees Dreams — Contact Server            ║');
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log(`║  Website:  http://localhost:${PORT}                       ║`);
  console.log(`║  API:      http://localhost:${PORT}/api/contact           ║`);
  console.log(`║  Health:   http://localhost:${PORT}/api/health            ║`);
  console.log('╠══════════════════════════════════════════════════════╣');
  console.log('║  Recipient:', (process.env.RECIPIENT_EMAIL || 'soundarfrancis@gmail.com').padEnd(41), '║');
  console.log('║  SMTP:     ', (process.env.SMTP_HOST || 'smtp.gmail.com') + ':' + (process.env.SMTP_PORT || '587').padEnd(35), '║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log('');
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your-sending-address@gmail.com') {
    console.warn('⚠  WARNING: SMTP_USER is not configured in .env');
    console.warn('   Email delivery will fail until you set up Gmail credentials.');
    console.warn('   See .env.example for setup instructions.\n');
  }
});

module.exports = app;

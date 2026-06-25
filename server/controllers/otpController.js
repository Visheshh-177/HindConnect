const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { OtpVerification } = require('../db');

const OTP_EXPIRY_MS = 5 * 60 * 1000;      // 5 minutes
const RESEND_COOLDOWN_MS = 30 * 1000;       // 30 seconds
const MAX_ATTEMPTS = 5;

// ── Nodemailer transporter ────────────────────────────────────────────────────
const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

// ── Branded email HTML template ───────────────────────────────────────────────
const buildEmailHtml = (otp) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#0f2942 0%,#1e3e62 100%);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;">
                🔐 HindConnect
              </h1>
              <p style="margin:4px 0 0;color:#f97316;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">
                HINDALCO INDUSTRIES LIMITED
              </p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 8px;color:#0f2942;font-size:18px;font-weight:700;">
                Email Verification Code
              </h2>
              <p style="margin:0 0 28px;color:#64748b;font-size:13px;line-height:1.6;">
                You requested to register on the HindConnect Enterprise Portal. Use the 6-digit OTP below to verify your email address. This code is valid for <strong>5 minutes</strong>.
              </p>
              <!-- OTP Box -->
              <div style="background:#f8fafc;border:2px dashed #f97316;border-radius:12px;padding:24px;text-align:center;margin:0 0 28px;">
                <p style="margin:0 0 6px;color:#94a3b8;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Your Verification Code</p>
                <span style="font-size:42px;font-weight:900;letter-spacing:10px;color:#0f2942;font-family:'Courier New',monospace;">${otp}</span>
              </div>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
                <tr>
                  <td style="background:#fef9f0;border-left:4px solid #f97316;border-radius:0 8px 8px 0;padding:12px 16px;">
                    <p style="margin:0;color:#92400e;font-size:12px;font-weight:600;">
                      ⚠️ Do not share this code with anyone. HindConnect IT will never ask for your OTP.
                    </p>
                  </td>
                </tr>
              </table>
              <p style="margin:0;color:#94a3b8;font-size:11px;">
                If you did not request this code, please ignore this email. Your account will not be created.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:10px;">
                © 2026 HindConnect · Hindalco Industries Ltd. · Authorized Corporate Use Only
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

// ── POST /api/auth/send-otp ───────────────────────────────────────────────────
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailLower = email.toLowerCase().trim();

    // 1. Check resend cooldown
    const existing = await OtpVerification.findOne({ email: emailLower });
    if (existing && existing.lastSentAt) {
      const elapsed = Date.now() - new Date(existing.lastSentAt).getTime();
      if (elapsed < RESEND_COOLDOWN_MS) {
        const waitSec = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
        return res.status(429).json({
          message: `Please wait ${waitSec} second(s) before requesting another OTP.`,
          cooldownRemaining: waitSec,
        });
      }
    }

    // 2. Generate a cryptographically secure 6-digit OTP
    const otp = String(crypto.randomInt(100000, 999999));

    // 3. Hash the OTP
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);

    // 4. Upsert the OTP record (overwrite previous if any)
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);
    await OtpVerification.upsert(
      { email: emailLower },
      {
        email: emailLower,
        hashedOtp,
        expiresAt,
        attempts: 0,
        lastSentAt: new Date(),
      }
    );

    // 5. Send email
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"HindConnect Portal" <${process.env.EMAIL_USER}>`,
      to: emailLower,
      subject: '🔐 Your HindConnect Registration OTP',
      html: buildEmailHtml(otp),
    });

    return res.status(200).json({ message: 'OTP sent successfully. Please check your email.' });
  } catch (error) {
    console.error('sendOtp error:', error);
    // Surface nodemailer auth errors helpfully
    if (error.code === 'EAUTH') {
      return res.status(500).json({ message: 'Email service authentication failed. Please contact IT support.' });
    }
    return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
  }
};

// ── POST /api/auth/verify-otp ─────────────────────────────────────────────────
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const emailLower = email.toLowerCase().trim();
    const record = await OtpVerification.findOne({ email: emailLower });

    // 1. No OTP record found
    if (!record) {
      return res.status(400).json({ message: 'No OTP found for this email. Please request a new one.' });
    }

    // 2. Check expiry
    if (new Date() > new Date(record.expiresAt)) {
      await OtpVerification.deleteOne({ email: emailLower });
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    // 3. Check attempt limit BEFORE incrementing
    if (record.attempts >= MAX_ATTEMPTS) {
      return res.status(429).json({
        message: 'Too many failed attempts. Please request a new OTP.',
        blocked: true,
      });
    }

    // 4. Increment attempt count
    await OtpVerification.updateOne(
      { email: emailLower },
      { attempts: record.attempts + 1 }
    );

    // 5. Compare OTP
    const isValid = await bcrypt.compare(String(otp).trim(), record.hashedOtp);

    if (!isValid) {
      const remaining = MAX_ATTEMPTS - (record.attempts + 1);
      if (remaining <= 0) {
        return res.status(429).json({
          message: 'Too many failed attempts. Please request a new OTP.',
          blocked: true,
          attemptsRemaining: 0,
        });
      }
      return res.status(400).json({
        message: `Invalid OTP. ${remaining} attempt(s) remaining.`,
        attemptsRemaining: remaining,
      });
    }

    // 6. OTP is valid — clean up the record
    await OtpVerification.deleteOne({ email: emailLower });

    return res.status(200).json({
      verified: true,
      message: 'Email verified successfully.',
    });
  } catch (error) {
    console.error('verifyOtp error:', error);
    return res.status(500).json({ message: 'OTP verification failed. Please try again.' });
  }
};

module.exports = { sendOtp, verifyOtp };

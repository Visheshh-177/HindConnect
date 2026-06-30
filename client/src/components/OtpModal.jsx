import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '../api';
import { ShieldCheck, Mail, RotateCcw, AlertCircle, CheckCircle2, X, Loader2 } from 'lucide-react';

const OTP_LENGTH = 6;
const OTP_VALIDITY_SEC = 5 * 60;  // 5 minutes
const RESEND_COOLDOWN_SEC = 30;

export default function OtpModal({ email, onVerified, onClose }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  // OTP validity countdown (5 min)
  const [validityLeft, setValidityLeft] = useState(OTP_VALIDITY_SEC);
  // Resend cooldown countdown (30 sec)
  const [resendLeft, setResendLeft] = useState(RESEND_COOLDOWN_SEC);

  const inputRefs = useRef([]);

  // ── Timers ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const validityTimer = setInterval(() => {
      setValidityLeft((v) => {
        if (v <= 1) {
          clearInterval(validityTimer);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(validityTimer);
  }, []);

  useEffect(() => {
    if (resendLeft <= 0) return;
    const resendTimer = setInterval(() => {
      setResendLeft((v) => {
        if (v <= 1) { clearInterval(resendTimer); return 0; }
        return v - 1;
      });
    }, 1000);
    return () => clearInterval(resendTimer);
  }, [resendLeft]);

  // Focus first input on mount
  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────
  const maskedEmail = (addr) => {
    const [name, domain] = addr.split('@');
    const visible = name.length > 3 ? name.slice(0, 3) : name.slice(0, 1);
    return `${visible}${'*'.repeat(Math.max(name.length - 3, 1))}@${domain}`;
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // ── Input handlers ────────────────────────────────────────────────────────
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;          // digits only
    const val = value.slice(-1);               // take last char if paste
    const next = [...digits];
    next[index] = val;
    setDigits(next);
    setError('');
    if (val && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-submit when all digits filled
    if (val && index === OTP_LENGTH - 1 && next.every(Boolean)) {
      handleVerify(next.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    if (!text) return;
    const next = Array(OTP_LENGTH).fill('');
    text.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const nextFocus = Math.min(text.length, OTP_LENGTH - 1);
    inputRefs.current[nextFocus]?.focus();
    if (text.length === OTP_LENGTH) {
      handleVerify(text);
    }
  };

  // ── Verify OTP ────────────────────────────────────────────────────────────
  const handleVerify = useCallback(async (otpCode) => {
    const code = otpCode ?? digits.join('');
    if (code.length < OTP_LENGTH) {
      setError('Please enter all 6 digits.');
      return;
    }
    if (validityLeft <= 0) {
      setError('OTP has expired. Please request a new one.');
      return;
    }
    try {
      setVerifying(true);
      setError('');
      await api.verifyOtp(email, code);
      setSuccess(true);
      setTimeout(() => onVerified(), 1200);
    } catch (err) {
      setDigits(Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      if (err.message?.includes('blocked') || err.message?.includes('Too many')) {
        setError(err.message);
      } else {
        setError(err.message || 'Invalid OTP. Please try again.');
      }
    } finally {
      setVerifying(false);
    }
  }, [digits, email, validityLeft, onVerified]);

  // ── Resend OTP ────────────────────────────────────────────────────────────
  const handleResend = async () => {
    if (resendLeft > 0) return;
    try {
      setResending(true);
      setError('');
      await api.sendOtp(email);
      setDigits(Array(OTP_LENGTH).fill(''));
      setValidityLeft(OTP_VALIDITY_SEC);
      setResendLeft(RESEND_COOLDOWN_SEC);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // ── Validity color ────────────────────────────────────────────────────────
  const validityColor = validityLeft > 60
    ? 'text-emerald-600'
    : validityLeft > 20
    ? 'text-amber-500'
    : 'text-red-500';

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-[#0f2942] to-[#1e3e62] px-8 py-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 bg-orange-500/20 border border-orange-400/30 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Verify Your Email</h2>
              <p className="text-orange-400 text-[10px] font-bold uppercase tracking-widest">
                Email OTP Verification
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5">
          {/* Email info */}
          <div className="flex items-start space-x-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <Mail className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">OTP sent to</p>
              <p className="text-sm font-bold text-slate-700">{maskedEmail(email)}</p>
            </div>
            {/* Validity timer */}
            <div className="ml-auto text-right flex-shrink-0">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Expires in</p>
              <p className={`text-sm font-black font-mono ${validityColor}`}>
                {validityLeft > 0 ? formatTime(validityLeft) : 'Expired'}
              </p>
            </div>
          </div>

          {/* Success state */}
          {success ? (
            <div className="flex flex-col items-center py-4 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-9 h-9 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-emerald-700">Email verified! Setting up your account…</p>
            </div>
          ) : (
            <>
              {/* OTP digit inputs */}
              <div>
                <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-3">
                  Enter 6-Digit OTP
                </p>
                <div className="flex space-x-2 justify-center" onPaste={handlePaste}>
                  {digits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className={[
                        'w-11 h-14 text-center text-xl font-black rounded-xl border-2 transition-all duration-150 outline-none',
                        'bg-slate-50 text-slate-800 shadow-sm',
                        digit
                          ? 'border-orange-400 bg-orange-50 text-orange-700 shadow-orange-100 shadow-md scale-105'
                          : 'border-slate-200 hover:border-slate-300 focus:border-orange-400 focus:ring-2 focus:ring-orange-100',
                        error && !digit ? 'border-red-300 bg-red-50' : '',
                      ].join(' ')}
                    />
                  ))}
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start space-x-2 bg-red-50 border border-red-200 rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-red-700">{error}</p>
                </div>
              )}

              {/* Verify button */}
              <button
                onClick={() => handleVerify()}
                disabled={verifying || digits.some((d) => !d) || validityLeft <= 0}
                className={[
                  'w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center space-x-2 shadow-md',
                  verifying || digits.some((d) => !d) || validityLeft <= 0
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-orange-500 hover:bg-orange-600 text-white hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5',
                ].join(' ')}
              >
                {verifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying…</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Verify & Continue Registration</span>
                  </>
                )}
              </button>

              {/* Resend OTP */}
              <div className="flex items-center justify-center space-x-2 pt-1">
                <p className="text-xs text-slate-500">Didn't receive the code?</p>
                <button
                  onClick={handleResend}
                  disabled={resendLeft > 0 || resending}
                  className={[
                    'text-xs font-bold flex items-center space-x-1 transition-all',
                    resendLeft > 0 || resending
                      ? 'text-slate-400 cursor-not-allowed'
                      : 'text-orange-500 hover:text-orange-600 cursor-pointer',
                  ].join(' ')}
                >
                  {resending ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <RotateCcw className="w-3 h-3" />
                  )}
                  <span>
                    {resendLeft > 0
                      ? `Resend in ${resendLeft}s`
                      : resending
                      ? 'Sending…'
                      : 'Resend OTP'}
                  </span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer note */}
        <div className="px-8 py-3 bg-slate-50 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 text-center font-medium">
            🔒 OTP is valid for 5 minutes · Maximum 5 attempts · HindConnect Portal
          </p>
        </div>
      </div>
    </div>
  );
}

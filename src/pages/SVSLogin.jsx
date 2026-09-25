import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function SVSLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false); // Loading state
  const navigate = useNavigate();

  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3500);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true); // Start loading spinner
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, { email, password });
      if (res.data.success) {
        localStorage.setItem('svs_token', res.data.token);
        showToast("Login successful! Redirecting...", "success");
        setTimeout(() => {
          navigate('/admin/dashboard'); 
        }, 1200);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || "Invalid login details.";
      showToast(errorMsg, "error");
      setIsAuthenticating(false); // Stop loading spinner on error
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        /* ── TOAST NOTIFICATION CSS ── */
        .svsd-toast {
          position: fixed;
          bottom: 30px;
          left: 30px;
          background: #111d14;
          color: white;
          padding: 16px 20px;
          border-radius: 8px;
          box-shadow: 0 10px 40px rgba(17,29,20,0.4);
          z-index: 1000;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transform: translateX(-150%);
          transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
          overflow: hidden;
          min-width: 320px;
        }
        .svsd-toast.show {
          transform: translateX(0);
        }
        .svsd-toast-message {
          font-weight: 500;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .svsd-toast-bar-wrap {
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          width: 100%;
          overflow: hidden;
        }
        .svsd-toast-bar {
          height: 100%;
          background: #1bba6b;
          width: 100%;
          transform-origin: left;
        }
        .svsd-toast.error .svsd-toast-bar { background: #e74c3c; }
        .svsd-toast.error .svsd-toast-icon { color: #e74c3c; }
        .svsd-toast.success .svsd-toast-icon { color: #1bba6b; }
        @keyframes shrinkToastBar { from { width: 100%; } to { width: 0%; } }
        .svsd-toast.show .svsd-toast-bar { animation: shrinkToastBar 3.5s linear forwards; }

        .svsl-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', sans-serif;
          -webkit-font-smoothing: antialiased;
          background: #111d14;
          overflow: hidden;
          position: relative;
        }

        /* ── LEFT PANEL ── */
        .svsl-left {
          display: none; flex: 1; background: #111d14; position: relative; overflow: hidden;
          align-items: center; justify-content: center; flex-direction: column; padding: 60px 56px;
        }
        @media (min-width: 900px) { .svsl-left { display: flex; } }

        .svsl-left::before {
          content: ''; position: absolute; inset: 0;
          background-image: repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(27,186,107,0.055) 28px, rgba(27,186,107,0.055) 29px);
          pointer-events: none;
        }
        .svsl-left::after {
          content: ''; position: absolute; top: 0; left: 0; width: 380px; height: 380px;
          background: radial-gradient(ellipse at top left, rgba(27,186,107,0.18) 0%, transparent 65%);
          pointer-events: none;
        }

        .svsl-left-rings { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; }
        .svsl-ring { position: absolute; border-radius: 50%; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .svsl-ring-1 { width: 200px; height: 200px; border: 1px solid rgba(27,186,107,0.22); }
        .svsl-ring-2 { width: 360px; height: 360px; border: 1px solid rgba(27,186,107,0.11); }
        .svsl-ring-3 { width: 520px; height: 520px; border: 1px solid rgba(27,186,107,0.055); }
        .svsl-ring-4 { width: 700px; height: 700px; border: 1px solid rgba(27,186,107,0.025); }

        .svsl-left-content { position: relative; z-index: 1; text-align: center; }

        .svsl-left-emblem {
          width: 90px; height: 90px; border-radius: 14px; background: rgba(27,186,107,0.10); border: 1px solid rgba(27,186,107,0.32);
          box-shadow: 0 0 0 6px rgba(27,186,107,0.05), 0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(27,186,107,0.14);
          display: flex; align-items: center; justify-content: center; margin: 0 auto 32px; overflow: hidden; padding: 14px;
        }
        .svsl-left-emblem img { width: 100%; height: 100%; object-fit: contain; filter: brightness(1.1); }
        .svsl-left-name { font-family: 'DM Serif Display', serif; font-size: 26px; font-weight: 400; color: #fff; letter-spacing: -0.4px; line-height: 1.2; margin-bottom: 7px; }
        .svsl-left-pvt { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 3.5px; text-transform: uppercase; color: #1bba6b; margin-bottom: 36px; }
        .svsl-left-divider { width: 40px; height: 2px; background: #1bba6b; margin: 0 auto 36px; border-radius: 1px; }
        .svsl-left-tagline { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 18px; color: rgba(255,255,255,0.40); line-height: 1.75; max-width: 280px; letter-spacing: 0.1px; }
        .svsl-left-since { margin-top: 52px; font-family: 'JetBrains Mono', monospace; font-size: 10px; letter-spacing: 2.5px; text-transform: uppercase; color: rgba(27,186,107,0.42); }

        /* ── RIGHT PANEL ── */
        .svsl-right {
          width: 100%; min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: #ffffff; position: relative; padding: 40px 24px;
        }
        @media (min-width: 900px) { .svsl-right { width: 460px; min-width: 460px; flex-shrink: 0; } }

        .svsl-right::before {
          content: ''; position: absolute; inset: 0;
          background-image: radial-gradient(rgba(17,29,20,0.07) 1px, transparent 1px);
          background-size: 24px 24px; pointer-events: none;
        }

        .svsl-form-wrap { position: relative; z-index: 1; width: 100%; max-width: 380px; }

        .svsl-mobile-brand { text-align: center; margin-bottom: 40px; }
        @media (min-width: 900px) { .svsl-mobile-brand { display: none; } }
        .svsl-mobile-emblem {
          width: 60px; height: 60px; border-radius: 10px; background: rgba(27,186,107,0.07); border: 1px solid rgba(27,186,107,0.22);
          box-shadow: 0 4px 20px rgba(17,29,20,0.10); display: flex; align-items: center; justify-content: center; margin: 0 auto 14px; overflow: hidden; padding: 10px;
        }
        .svsl-mobile-emblem img { width: 100%; height: 100%; object-fit: contain; }
        .svsl-mobile-name { font-family: 'DM Serif Display', serif; font-size: 18px; font-weight: 400; color: #111d14; letter-spacing: -0.2px; }
        .svsl-mobile-pvt { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 3px; text-transform: uppercase; color: #1bba6b; margin-top: 4px; }

        .svsl-heading { margin-bottom: 32px; }
        .svsl-heading-eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; color: #1bba6b; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
        .svsl-heading-eyebrow::before { content: ''; display: inline-block; width: 22px; height: 2px; background: #1bba6b; border-radius: 1px; flex-shrink: 0; }
        .svsl-heading-title { font-family: 'DM Serif Display', serif; font-size: 38px; font-weight: 400; color: #111d14; line-height: 1.12; letter-spacing: -0.9px; margin-bottom: 12px; }
        .svsl-heading-sub { font-family: 'Inter', sans-serif; font-size: 12px; color: #7a9180; font-weight: 400; letter-spacing: 0.1px; line-height: 1.55; }

        .svsl-rule { height: 1px; background: #e6ede8; margin-bottom: 28px; }

        .svsl-field { margin-bottom: 20px; }
        .svsl-label { display: block; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.6px; text-transform: uppercase; color: #3d5245; margin-bottom: 8px; }
        .svsl-input-wrap { position: relative; }
        .svsl-input-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #7a9180; pointer-events: none; display: flex; align-items: center; justify-content: center; }
        .svsl-input {
          width: 100%; padding: 13px 14px 13px 42px; border: 1.5px solid #cdd9d0; border-radius: 6px; font-family: 'Inter', sans-serif; font-size: 14px;
          color: #111d14; background: #f7faf8; outline: none; transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s; letter-spacing: 0px;
        }
        .svsl-input::placeholder { color: #aabcb2; font-weight: 400; font-size: 13px; }
        .svsl-input:focus { border-color: #1bba6b; box-shadow: 0 0 0 3px rgba(27,186,107,0.12); background: #fff; }

        /* Submit button and Loader */
        .svsl-btn {
          width: 100%;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 8px;
          padding: 15px 24px;
          background: #111d14;
          color: #fff;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          box-shadow: 0 4px 18px rgba(17,29,20,0.28);
          transition: background 0.22s ease, transform 0.15s ease, box-shadow 0.22s ease;
          position: relative;
          overflow: hidden;
        }
        .svsl-btn::before {
          content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(27,186,107,0.16), transparent);
          transition: left 0.5s ease;
        }
        .svsl-btn:hover:not(:disabled)::before { left: 100%; }
        .svsl-btn:hover:not(:disabled) {
          background: #1bba6b; transform: translateY(-1px); box-shadow: 0 8px 28px rgba(27,186,107,0.38);
        }
        .svsl-btn:active:not(:disabled) { transform: translateY(0); }
        .svsl-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .svsl-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: svslSpin 0.8s linear infinite;
        }
        @keyframes svslSpin {
          to { transform: rotate(360deg); }
        }

        /* Security notice */
        .svsl-security {
          display: flex; align-items: center; gap: 10px; margin-top: 20px; padding: 10px 14px;
          background: rgba(27,186,107,0.05); border: 1px solid rgba(27,186,107,0.16); border-radius: 6px; border-left: 3px solid #1bba6b;
        }
        .svsl-security-dot { width: 6px; height: 6px; border-radius: 50%; background: #1bba6b; flex-shrink: 0; box-shadow: 0 0 7px rgba(27,186,107,0.55); animation: svsSecPulse 2.2s ease-in-out infinite; }
        @keyframes svsSecPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .svsl-security-text { font-family: 'Inter', sans-serif; font-size: 11px; color: #7a9180; line-height: 1.45; letter-spacing: 0.1px; }

        /* Footer */
        .svsl-footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid #e6ede8; display: flex; align-items: center; justify-content: space-between; }
        .svsl-footer-copy { font-family: 'Inter', sans-serif; font-size: 10px; color: #aabcb2; letter-spacing: 0.2px; }
        .svsl-footer-mark { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #1bba6b; font-weight: 500; letter-spacing: 0.3px; opacity: 0.75; }
      `}</style>

      {/* ── TOAST NOTIFICATION COMPONENT ── */}
      <div className={`svsd-toast ${toast.type} ${toast.visible ? 'show' : ''}`}>
        <div className="svsd-toast-message">
          {toast.type === 'success' ? (
            <svg className="svsd-toast-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ) : (
            <svg className="svsd-toast-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          )}
          {toast.message}
        </div>
        <div className="svsd-toast-bar-wrap">
          <div className="svsd-toast-bar"></div>
        </div>
      </div>

      <div className="svsl-root">

        {/* LEFT PANEL */}
        <div className="svsl-left">
          <div className="svsl-left-rings">
            <div className="svsl-ring svsl-ring-1" />
            <div className="svsl-ring svsl-ring-2" />
            <div className="svsl-ring svsl-ring-3" />
            <div className="svsl-ring svsl-ring-4" />
          </div>
          <div className="svsl-left-content">
            <div className="svsl-left-emblem">
              <img src={logo} alt="Ganga Kaveri Seeds Logo" />
            </div>
            <div className="svsl-left-name">Ganga Kaveri Seeds</div>
            <div className="svsl-left-pvt">Pvt. Ltd.</div>
            <div className="svsl-left-divider" />
            <div className="svsl-left-tagline">
              Cultivating trust and quality across every seed, every season.
            </div>
            <div className="svsl-left-since">Telangana, India</div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="svsl-right">
          <div className="svsl-form-wrap">

            {/* Mobile brand (hidden on desktop) */}
            <div className="svsl-mobile-brand">
              <div className="svsl-mobile-emblem">
                <img src={logo} alt="Ganga Kaveri Seeds Logo" />
              </div>
              <div className="svsl-mobile-name">Ganga Kaveri Seeds</div>
              <div className="svsl-mobile-pvt">Pvt. Ltd.</div>
            </div>

            <div className="svsl-heading">
              <div className="svsl-heading-eyebrow">Admin Portal</div>
              <div className="svsl-heading-title">Sign in to<br />your dashboard</div>
              <div className="svsl-heading-sub">Restricted access — authorised personnel only</div>
            </div>

            <div className="svsl-rule" />

            <form onSubmit={handleLogin}>
              <div className="svsl-field">
                <label className="svsl-label">Email Address</label>
                <div className="svsl-input-wrap">
                  <div className="svsl-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <input
                    className="svsl-input"
                    type="email"
                    placeholder="admin@gkseeds.in"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="svsl-field">
                <label className="svsl-label">Password</label>
                <div className="svsl-input-wrap">
                  <div className="svsl-input-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  </div>
                  <input
                    className="svsl-input"
                    type="password"
                    placeholder="Enter your password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="svsl-btn" disabled={isAuthenticating}>
                {isAuthenticating ? <div className="svsl-spinner"></div> : "Sign In to Dashboard"}
              </button>
            </form>

            <div className="svsl-security">
              <div className="svsl-security-dot" />
              <div className="svsl-security-text">
                Secured connection — all sessions are encrypted and monitored
              </div>
            </div>

            <div className="svsl-footer">
              <div className="svsl-footer-copy">© {new Date().getFullYear()} Ganga Kaveri Seeds Pvt. Ltd.</div>
              <div className="svsl-footer-mark"></div>
            </div>

          </div>
        </div>

      </div>
    </>
  );
}
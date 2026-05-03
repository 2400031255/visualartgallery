import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import './LoginPage.css';

/* ─────────────────────────────────────────
   Shared micro-components
───────────────────────────────────────── */
const EyeIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    {open
      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
    }
  </svg>
);

const StrengthBar = ({ password, passwordStrength }) => {
  if (!password) return null;
  const s = passwordStrength(password);
  const w = { weak: '33%', fair: '66%', strong: '100%' };
  return (
    <div className="strength-wrap">
      <div className="strength-track"><div className="strength-fill" style={{ width: w[s.level], background: s.color }} /></div>
      <span className="strength-label" style={{ color: s.color }}>{s.label}</span>
    </div>
  );
};

const PwRequirements = ({ password }) => (
  <ul className="pw-requirements">
    {[
      { label: '8+ characters',    ok: password.length >= 8 },
      { label: 'Uppercase',        ok: /[A-Z]/.test(password) },
      { label: 'Lowercase',        ok: /[a-z]/.test(password) },
      { label: 'Number',           ok: /[0-9]/.test(password) },
      { label: 'Special char',     ok: /[^A-Za-z0-9]/.test(password) },
    ].map(c => (
      <li key={c.label} className={c.ok ? 'req-ok' : 'req-fail'}>
        <span>{c.ok ? '✓' : '○'}</span> {c.label}
      </li>
    ))}
  </ul>
);

const Bg = ({ particles }) => (
  <div className="login-bg">
    <div className="bg-orb bg-orb-1" />
    <div className="bg-orb bg-orb-2" />
    <div className="bg-orb bg-orb-3" />
    {particles.map(p => (
      <div key={p.id} className="particle" style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.dur, width: p.size, height: p.size }} />
    ))}
  </div>
);

const Logo = () => (
  <div className="login-logo">
    <span className="logo-mark">✦</span>
    <div>
      <h1>Galerie Lumière</h1>
      <span>Virtual Fine Art Gallery</span>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   SCREEN 1 — Landing / Portal Selector
───────────────────────────────────────── */
const LandingScreen = ({ onSelect, particles }) => (
  <div className="lp-screen lp-landing">
    <Bg particles={particles} />

    <div className="lp-landing-inner">
      <Logo />
      <div className="login-header-line" style={{ marginBottom: '3rem' }} />

      <p className="login-eyebrow">Est. 2024 · Curated Excellence</p>
      <h2 className="login-headline">Where Art Meets<br /><em>Eternity</em></h2>
      <div className="gold-divider" style={{ margin: '1.5rem auto' }} />
      <p className="login-tagline">Select your portal to continue</p>

      <div className="portal-selector">
        {/* User Portal Card */}
        <button className="portal-card portal-card-user" onClick={() => onSelect('user')}>
          <div className="pc-glow" />
          <div className="pc-icon-wrap pc-icon-user">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h3>User Portal</h3>
          <p>Visitors &amp; Collectors</p>
          <ul className="pc-features">
            <li>✦ Browse the gallery</li>
            <li>✦ Acquire artworks</li>
            <li>✦ Virtual tours</li>
          </ul>
          <div className="pc-enter">
            Enter <span>→</span>
          </div>
        </button>

        {/* Divider */}
        <div className="landing-divider">
          <div className="ld-line" />
          <span className="ld-or">or</span>
          <div className="ld-line" />
        </div>

        {/* Admin Portal Card */}
        <button className="portal-card portal-card-admin" onClick={() => onSelect('admin')}>
          <div className="pc-glow pc-glow-admin" />
          <div className="pc-icon-wrap pc-icon-admin">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h3>Admin Portal</h3>
          <p>Artists, Curators &amp; Admins</p>
          <ul className="pc-features">
            <li>⬡ Manage artworks</li>
            <li>⬡ Curate exhibitions</li>
            <li>⬡ Gallery administration</li>
          </ul>
          <div className="pc-enter pc-enter-admin">
            Enter <span>→</span>
          </div>
        </button>
      </div>

      <div className="login-footer">
        <p>© 2024 Galerie Lumière · All rights reserved</p>
        <p>Sessions expire after 60 min · Accounts lock after 5 failed attempts</p>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────
   SCREEN 2 — User Portal (visitor/collector)
───────────────────────────────────────── */
const UserPortalScreen = ({ onBack, onSuccess, particles }) => {
  const { login, signup, passwordStrength } = useAuth();
  const [mode, setMode]       = useState('login');
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw]   = useState(false);
  const [showCf, setShowCf]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 600));

    if (mode === 'login') {
      const res = login(form.email, form.password);
      if (!res.ok) { setError(res.error); setLoading(false); return; }
      onSuccess(res.user);
    } else {
      if (!form.name.trim()) { setError('Full name is required.'); setLoading(false); return; }
      if (form.password !== form.confirm) { setError('Passwords do not match.'); setLoading(false); return; }
      const res = signup(form.name.trim(), form.email, form.password, 'visitor');
      if (!res.ok) { setError(res.error); setLoading(false); return; }
      onSuccess(res.user);
    }
    setLoading(false);
  };

  return (
    <div className="lp-screen lp-portal lp-portal-user">
      <Bg particles={particles} />

      {/* Left panel — branding */}
      <div className="lp-side lp-side-left">
        <Logo />
        <div className="lp-side-content">
          <div className="lp-side-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h2>User Portal</h2>
          <p>Your gateway to the world's finest curated artworks</p>
          <div className="gold-divider" style={{ margin: '1.5rem 0' }} />
          <ul className="lp-side-features">
            <li><span>✦</span> Browse masterworks from every era</li>
            <li><span>✦</span> Acquire pieces for your collection</li>
            <li><span>✦</span> Immersive virtual gallery tours</li>
            <li><span>✦</span> Personalised recommendations</li>
          </ul>
        </div>
        <div className="lp-side-demo">
          <p>Demo credentials</p>
          <code>visitor@gallery.com</code>
          <code>Visit@123</code>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="lp-side lp-side-right">
        <button className="back-btn" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>

        <div className="lp-form-wrap">
          <div className="portal-badge">
            <span>◈</span> Visitor &amp; Collector Access
          </div>
          <h2 className="portal-title">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="portal-sub">{mode === 'login' ? 'Sign in to your gallery account' : 'Join the Galerie Lumière community'}</p>

          <div className="tab-row">
            <button className={`tab-btn ${mode === 'login' ? 'tab-active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>Sign In</button>
            <button className={`tab-btn ${mode === 'signup' ? 'tab-active' : ''}`} onClick={() => { setMode('signup'); setError(''); }}>Register</button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {mode === 'signup' && (
              <div className="field-group">
                <label>Full Name</label>
                <input type="text" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} required autoComplete="name" />
              </div>
            )}
            <div className="field-group">
              <label>Email Address</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} required autoComplete="email" />
            </div>
            <div className="field-group">
              <label>Password</label>
              <div className="pw-wrap">
                <input type={showPw ? 'text' : 'password'} placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'} value={form.password} onChange={e => set('password', e.target.value)} required autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
                <button type="button" className="eye-btn" onClick={() => setShowPw(v => !v)} tabIndex={-1}><EyeIcon open={showPw} /></button>
              </div>
              {mode === 'signup' && form.password && <><StrengthBar password={form.password} passwordStrength={passwordStrength} /><PwRequirements password={form.password} /></>}
            </div>
            {mode === 'signup' && (
              <div className="field-group">
                <label>Confirm Password</label>
                <div className="pw-wrap">
                  <input type={showCf ? 'text' : 'password'} placeholder="Repeat your password" value={form.confirm} onChange={e => set('confirm', e.target.value)} required autoComplete="new-password" />
                  <button type="button" className="eye-btn" onClick={() => setShowCf(v => !v)} tabIndex={-1}><EyeIcon open={showCf} /></button>
                </div>
                {form.confirm && form.password !== form.confirm && <span className="field-error">Passwords do not match</span>}
              </div>
            )}
            {error && <div className="auth-error"><span>⚠</span> {error}</div>}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? <span className="spinner" /> : mode === 'login' ? 'Enter Gallery' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   SCREEN 3 — Admin Portal (username + password only)
───────────────────────────────────────── */
const AdminPortalScreen = ({ onBack, onSuccess, particles }) => {
  const { adminLogin } = useAuth();
  const [form, setForm]       = useState({ username: '', password: '' });
  const [showPw, setShowPw]   = useState(false);
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 600));
    const res = adminLogin(form.username, form.password);
    if (!res.ok) { setError(res.error); setLoading(false); return; }
    onSuccess(res.user);
    setLoading(false);
  };

  return (
    <div className="lp-screen lp-portal lp-portal-admin">
      <Bg particles={particles} />

      {/* Left panel */}
      <div className="lp-side lp-side-left lp-side-admin">
        <Logo />
        <div className="lp-side-content">
          <div className="lp-side-icon lp-side-icon-admin">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <h2>Admin Portal</h2>
          <p>Restricted access — authorised personnel only</p>
          <div className="gold-divider" style={{ margin: '1.5rem 0' }} />
          <ul className="lp-side-features">
            <li><span>⬡</span> Manage artworks &amp; collections</li>
            <li><span>⬡</span> Curate exhibitions</li>
            <li><span>⬡</span> User &amp; role management</li>
            <li><span>⬡</span> Full gallery administration</li>
          </ul>
        </div>
        <div className="lp-side-demo admin-locked-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0110 0v4"/>
          </svg>
          <span>Credentials are private &amp; restricted</span>
        </div>
      </div>

      {/* Right panel */}
      <div className="lp-side lp-side-right">
        <button className="back-btn" onClick={onBack}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>

        <div className="lp-form-wrap">
          <div className="portal-badge portal-badge-pro">
            <span>⬡</span> Administrator Access
          </div>
          <h2 className="portal-title">Admin Login</h2>
          <p className="portal-sub">Enter your administrator credentials</p>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="field-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="Enter username"
                value={form.username}
                onChange={e => set('username', e.target.value)}
                required
                autoComplete="username"
                autoFocus
              />
            </div>
            <div className="field-group">
              <label>Password</label>
              <div className="pw-wrap">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={form.password}
                  onChange={e => set('password', e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button type="button" className="eye-btn" onClick={() => setShowPw(v => !v)} tabIndex={-1}>
                  <EyeIcon open={showPw} />
                </button>
              </div>
            </div>
            {error && <div className="auth-error"><span>⚠</span> {error}</div>}
            <button type="submit" className="auth-submit auth-submit-pro" disabled={loading}>
              {loading ? <span className="spinner" /> : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────
   ROOT — LoginPage (manages screen state)
───────────────────────────────────────── */
const LoginPage = ({ onLogin }) => {
  const [screen, setScreen] = useState('landing'); // 'landing' | 'user' | 'admin'
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top:  `${Math.random() * 100}%`,
      delay: `${Math.random() * 6}s`,
      dur:   `${6 + Math.random() * 6}s`,
      size:  `${1 + Math.random() * 2}px`,
    }))
  );

  if (screen === 'user')  return <UserPortalScreen  onBack={() => setScreen('landing')} onSuccess={onLogin} particles={particles} />;
  if (screen === 'admin') return <AdminPortalScreen onBack={() => setScreen('landing')} onSuccess={onLogin} particles={particles} />;
  return <LandingScreen onSelect={setScreen} particles={particles} />;
};

export default LoginPage;

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS   = 15 * 60 * 1000;
const SESSION_MS   = 60 * 60 * 1000;

// Admin credentials — username based (not email)
export const ADMIN_CREDENTIALS = { username: 'nikhil', password: 'nikhil2006', name: 'Nikhil', role: 'admin', id: 0 };

const INITIAL_USERS = [
  { id: 1, name: 'Gallery Visitor',  email: 'visitor@gallery.com', password: 'Visit@123', role: 'visitor' },
];

export const passwordStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8)            score++;
  if (pw.length >= 12)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[a-z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  if (score <= 2) return { level: 'weak',   label: 'Weak',   color: '#e05252' };
  if (score <= 4) return { level: 'fair',   label: 'Fair',   color: '#e8a84c' };
  return              { level: 'strong', label: 'Strong', color: '#50c878' };
};

export const validatePassword = (pw) => {
  const errors = [];
  if (pw.length < 8)             errors.push('At least 8 characters');
  if (!/[A-Z]/.test(pw))         errors.push('One uppercase letter');
  if (!/[a-z]/.test(pw))         errors.push('One lowercase letter');
  if (!/[0-9]/.test(pw))         errors.push('One number');
  if (!/[^A-Za-z0-9]/.test(pw))  errors.push('One special character');
  return errors;
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers]             = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [attempts, setAttempts]       = useState({});
  const [sessionExpiry, setSessionExpiry] = useState(null);

  useEffect(() => {
    if (!sessionExpiry) return;
    const remaining = sessionExpiry - Date.now();
    if (remaining <= 0) { logout(); return; }
    const t = setTimeout(logout, remaining);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionExpiry]);

  const isLocked = useCallback((email) => {
    const a = attempts[email];
    if (!a || !a.lockedUntil) return false;
    if (Date.now() < a.lockedUntil) return a.lockedUntil;
    return false;
  }, [attempts]);

  const recordAttempt = useCallback((email, success) => {
    setAttempts(prev => {
      const a = prev[email] || { count: 0, lockedUntil: null };
      if (success) return { ...prev, [email]: { count: 0, lockedUntil: null } };
      const count = a.count + 1;
      const lockedUntil = count >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : null;
      return { ...prev, [email]: { count, lockedUntil } };
    });
  }, []);

  // Admin login — uses username, not email
  const adminLogin = useCallback((username, password) => {
    const key = `admin:${username}`;
    const lockUntil = isLocked(key);
    if (lockUntil) {
      const mins = Math.ceil((lockUntil - Date.now()) / 60000);
      return { ok: false, error: `Account locked. Try again in ${mins} minute${mins !== 1 ? 's' : ''}.` };
    }
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      recordAttempt(key, true);
      setCurrentUser(ADMIN_CREDENTIALS);
      setSessionExpiry(Date.now() + SESSION_MS);
      return { ok: true, user: ADMIN_CREDENTIALS };
    }
    recordAttempt(key, false);
    const count = (attempts[key]?.count || 0) + 1;
    const left  = MAX_ATTEMPTS - count;
    return {
      ok: false,
      error: left > 0
        ? `Invalid credentials. ${left} attempt${left !== 1 ? 's' : ''} remaining.`
        : 'Too many failed attempts. Account locked for 15 minutes.'
    };
  }, [attempts, isLocked, recordAttempt]);

  const login = useCallback((email, password) => {
    const lockUntil = isLocked(email);
    if (lockUntil) {
      const mins = Math.ceil((lockUntil - Date.now()) / 60000);
      return { ok: false, error: `Account locked. Try again in ${mins} minute${mins !== 1 ? 's' : ''}.` };
    }
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      recordAttempt(email, false);
      const count = (attempts[email]?.count || 0) + 1;
      const left  = MAX_ATTEMPTS - count;
      return {
        ok: false,
        error: left > 0
          ? `Invalid credentials. ${left} attempt${left !== 1 ? 's' : ''} remaining.`
          : 'Too many failed attempts. Account locked for 15 minutes.'
      };
    }
    recordAttempt(email, true);
    setCurrentUser(user);
    setSessionExpiry(Date.now() + SESSION_MS);
    return { ok: true, user };
  }, [users, attempts, isLocked, recordAttempt]);

  const signup = useCallback((name, email, password, role) => {
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
      return { ok: false, error: 'An account with this email already exists.' };
    const errors = validatePassword(password);
    if (errors.length)
      return { ok: false, error: `Password must include: ${errors.join(', ')}.` };
    const newUser = { id: Date.now(), name, email, password, role };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    setSessionExpiry(Date.now() + SESSION_MS);
    return { ok: true, user: newUser };
  }, [users]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setSessionExpiry(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, adminLogin, signup, logout, isLocked, passwordStrength, validatePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// AuthModal.jsx — Login & Register Modal
// ============================================================
// Shows a popup for users to login or create an account.
// Uses Firebase Authentication via authService.js
// ============================================================

import React, { useState, useEffect } from 'react';
import { X, User, Mail, Lock, Shield, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import { registerUser, loginUser } from '../firebase/authService';
import { firebaseReady } from '../firebase/config';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login');   // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('pilgrim');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form fields whenever the modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setRole('pilgrim');
      setShowPassword(false);
      setError('');
      setLoading(false);
    }
  }, [isOpen]);

  // Clear error when switching between login/register modes
  const handleModeSwitch = (newMode) => {
    setMode(newMode);
    setError('');
  };

  if (!isOpen) return null;

  // Map Firebase error codes to friendly messages
  const getFriendlyError = (err) => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/not-configured':
        return '🔧 Firebase is not configured yet. Please add your Firebase credentials to the .env file and restart the dev server.';
      case 'auth/user-not-found':
      case 'auth/invalid-credential':
        return 'No account found with this email, or the password is incorrect.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use':
        return 'This email is already registered. Try logging in instead.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please wait a moment and try again.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection and try again.';
      default:
        // Show the real error message for debugging instead of hiding it
        return err?.message || 'An unexpected error occurred. Please try again.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Pre-validate before hitting Firebase
    if (!firebaseReady) {
      setError('🔧 Firebase is not configured yet. Please add your Firebase credentials to the .env file and restart the dev server.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      let user;
      if (mode === 'register') {
        user = await registerUser(name.trim(), email.trim(), password, role);
      } else {
        user = await loginUser(email.trim(), password);
      }
      onAuthSuccess(user);
      // Don't call onClose() here — App.jsx onAuthSuccess already closes the modal
    } catch (err) {
      console.error('Auth error:', err);
      setError(getFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="sacred-glass max-w-md w-full rounded-3xl p-6 border-2 border-vedic-gold/50 shadow-2xl relative">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-prime to-vedic-gold flex items-center justify-center">
            <span className="text-2xl">🛕</span>
          </div>
          <div>
            <h2 className="text-xl font-black font-vedic text-white">DarshanSetu</h2>
            <p className="text-xs text-amber-200/60">
              {mode === 'login' ? 'Welcome back, Pilgrim' : 'Join the Pilgrim Safety Network'}
            </p>
          </div>
        </div>

        {/* Toggle Login / Register */}
        <div className="flex rounded-xl overflow-hidden border border-vedic-gold/30 mb-6">
          <button
            onClick={() => handleModeSwitch('login')}
            className={`flex-1 py-2 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-saffron-prime to-amber-600 text-white'
                : 'text-amber-200/60 hover:bg-white/5'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Login</span>
          </button>
          <button
            onClick={() => handleModeSwitch('register')}
            className={`flex-1 py-2 text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
              mode === 'register'
                ? 'bg-gradient-to-r from-saffron-prime to-amber-600 text-white'
                : 'text-amber-200/60 hover:bg-white/5'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Register</span>
          </button>
        </div>

        {/* Firebase not configured warning */}
        {!firebaseReady && (
          <div className="bg-amber-950/60 border border-amber-500/50 rounded-xl p-3 text-xs text-amber-300 mb-4">
            ⚠️ Firebase not configured. Copy <code className="bg-black/40 px-1 rounded">.env.example</code> → <code className="bg-black/40 px-1 rounded">.env</code>, fill in your Firebase credentials, and restart the dev server.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name field — only for registration */}
          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-semibold text-amber-200 block mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vedic-gold/60" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full bg-black/50 border border-vedic-gold/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-vedic-gold"
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="text-[11px] font-semibold text-amber-200 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vedic-gold/60" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full bg-black/50 border border-vedic-gold/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-vedic-gold"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[11px] font-semibold text-amber-200 block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vedic-gold/60" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                className="w-full bg-black/50 border border-vedic-gold/30 rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-vedic-gold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-vedic-gold/60 hover:text-vedic-gold"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role selector — only for registration */}
          {mode === 'register' && (
            <div>
              <label className="text-[11px] font-semibold text-amber-200 block mb-1">Register As</label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-vedic-gold/60" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-black/50 border border-vedic-gold/30 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-vedic-gold appearance-none"
                >
                  <option value="pilgrim" className="bg-temple-dark">Pilgrim / Devotee</option>
                  <option value="family" className="bg-temple-dark">Family Member (Group Tracker)</option>
                  <option value="staff"  className="bg-temple-dark">Temple Staff / Security</option>
                </select>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-950/60 border border-red-500/50 rounded-xl p-3 text-xs text-rose-300">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-saffron-prime to-amber-600 text-white font-black text-xs tracking-wider uppercase shadow-lg hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {loading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              <>
                {mode === 'login' ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{mode === 'login' ? 'Login to DarshanSetu' : 'Create Account'}</span>
              </>
            )}
          </button>
        </form>

        {/* Note about Firebase setup */}
        <p className="text-center text-[10px] text-white/30 mt-4 font-mono">
          🔒 Secured by Firebase Authentication
        </p>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, loginWithGoogle, signup } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(authModalMode === 'login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!isLoginMode && !name.trim()) {
      setError('Please enter your name.');
      return;
    }

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);
    try {
      if (isLoginMode) {
        await login(email);
      } else {
        await signup(email, name);
      }
    } catch (err) {
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSignIn = async () => {
    setLoading(true);
    await login('elena.vance@wanderlust.io', 'Elena Vance');
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#dec0bc]/80 relative overflow-hidden">
        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#8b716e] hover:bg-[#ffdad5]/50 transition-colors"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#ffdad5] text-[#a4362d] flex items-center justify-center mx-auto mb-3 shadow-inner">
            <span className="material-symbols-outlined text-2xl">travel_explore</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181c1d]">
            {isLoginMode ? 'Welcome Back' : 'Join TripBuilder'}
          </h2>
          <p className="text-sm text-[#57423f] mt-1">
            {isLoginMode
              ? 'Access your curated journeys & saved itineraries'
              : 'Start personalizing bespoke itineraries with AI precision'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 text-[#ba1a1a] text-xs font-medium flex items-center space-x-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign In Button */}
        <div className="space-y-3 mb-5">
          <button
            id="modal-google-signin-btn"
            type="button"
            onClick={async () => {
              setLoading(true);
              await loginWithGoogle();
              setLoading(false);
            }}
            className="w-full py-3 px-4 rounded-xl border border-[#dec0bc] bg-white hover:bg-[#ffdad5]/20 text-xs font-bold text-[#181c1d] transition-all flex items-center justify-center space-x-2.5 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="flex items-center space-x-2 my-2">
            <div className="flex-1 border-b border-[#dec0bc]/60"></div>
            <span className="text-[11px] uppercase font-semibold text-[#8b716e]">or with email</span>
            <div className="flex-1 border-b border-[#dec0bc]/60"></div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-[#57423f] uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  id="auth-name-input"
                  type="text"
                  placeholder="Elena Vance"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#dec0bc] focus:border-[#a4362d] focus:ring-2 focus:ring-[#ffdad5] text-sm text-[#181c1d] outline-none transition-all pl-10"
                />
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-[#8b716e]">
                  person
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#57423f] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                id="auth-email-input"
                type="email"
                placeholder="elena@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#dec0bc] focus:border-[#a4362d] focus:ring-2 focus:ring-[#ffdad5] text-sm text-[#181c1d] outline-none transition-all pl-10"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-[#8b716e]">
                mail
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#57423f] uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                id="auth-password-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#dec0bc] focus:border-[#a4362d] focus:ring-2 focus:ring-[#ffdad5] text-sm text-[#181c1d] outline-none transition-all pl-10"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-lg text-[#8b716e]">
                lock
              </span>
            </div>
          </div>

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#a4362d] hover:bg-[#8b2d25] text-white font-semibold text-sm shadow-md transition-all duration-200 mt-2 flex items-center justify-center space-x-2 disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
            ) : (
              <span>{isLoginMode ? 'Sign In to Account' : 'Create Account'}</span>
            )}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="mt-4 pt-4 border-t border-[#dec0bc]/40">
          <button
            id="demo-user-signin-btn"
            type="button"
            onClick={handleDemoSignIn}
            className="w-full py-2.5 rounded-xl border border-[#a4362d]/40 bg-[#ffdad5]/30 hover:bg-[#ffdad5]/60 text-[#a4362d] text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
          >
            <span className="material-symbols-outlined text-base">auto_fix_high</span>
            <span>Demo Explorer Quick Sign In (Elena Vance)</span>
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="text-center mt-4">
          <button
            id="toggle-auth-mode-btn"
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
            }}
            className="text-xs text-[#57423f] hover:text-[#a4362d] font-medium"
          >
            {isLoginMode
              ? "Don't have an account? Create one"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface GoogleSignInPageProps {
  onSuccess: () => void;
  onSkipAsGuest?: () => void;
}

export const GoogleSignInPage: React.FC<GoogleSignInPageProps> = ({
  onSuccess,
  onSkipAsGuest
}) => {
  const { loginWithGoogle, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'google' | 'email'>('google');
  
  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const ok = await loginWithGoogle();
      if (ok) {
        onSuccess();
      }
    } catch (e) {
      console.error(e);
      setError('Unable to complete Google sign-in. You can also sign in with Email/Password below.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(email, password, isRegister ? name : undefined);
      onSuccess();
    } catch (err) {
      setError('Sign in error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafb] flex flex-col justify-between relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffdad5]/40 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#dec0bc]/30 rounded-full blur-3xl pointer-events-none -ml-48 -mb-48"></div>

      {/* Top Header */}
      <header className="py-6 px-6 sm:px-12 flex items-center justify-between z-10 relative">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#a4362d] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-xl">travel_explore</span>
          </div>
          <span className="font-serif text-2xl font-bold tracking-tight text-[#181c1d]">
            TripBuilder
          </span>
        </div>

        {onSkipAsGuest && (
          <button
            id="google-signin-skip-btn"
            onClick={onSkipAsGuest}
            className="text-xs font-semibold text-[#57423f] hover:text-[#a4362d] transition-colors flex items-center space-x-1"
          >
            <span>Explore as Guest</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        )}
      </header>

      {/* Center Sign In Card */}
      <main className="max-w-md w-full mx-auto px-4 sm:px-6 my-auto z-10 relative py-6">
        <div className="bg-white rounded-3xl p-7 sm:p-9 border border-[#dec0bc]/80 shadow-2xl space-y-5">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ffdad5] text-[#a4362d] flex items-center justify-center mx-auto mb-2 shadow-inner">
              <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#a4362d]">
              Welcome to TripBuilder
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181c1d] tracking-tight">
              Sign in to begin
            </h1>
            <p className="text-xs text-[#57423f] leading-relaxed">
              Curate bespoke travel itineraries and sync your saved journeys across devices.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-[#f7fafb] p-1 rounded-xl border border-[#dec0bc]/60">
            <button
              type="button"
              onClick={() => { setActiveTab('google'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'google'
                  ? 'bg-white text-[#181c1d] shadow-xs'
                  : 'text-[#8b716e] hover:text-[#181c1d]'
              }`}
            >
              <span>Google Account</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('email'); setError(''); }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'email'
                  ? 'bg-white text-[#181c1d] shadow-xs'
                  : 'text-[#8b716e] hover:text-[#181c1d]'
              }`}
            >
              <span>Email & Password</span>
            </button>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 text-[#ba1a1a] text-xs font-medium flex items-center space-x-2">
              <span className="material-symbols-outlined text-base shrink-0">info</span>
              <span>{error}</span>
            </div>
          )}

          {activeTab === 'google' ? (
            /* Google Sign In Tab */
            <div className="space-y-4 pt-1">
              <button
                id="google-signin-btn"
                type="button"
                disabled={loading}
                onClick={handleGoogleSignIn}
                className="w-full py-3.5 px-5 rounded-2xl border-2 border-[#dec0bc] bg-white hover:bg-[#ffdad5]/20 hover:border-[#a4362d] text-sm font-bold text-[#181c1d] transition-all flex items-center justify-center space-x-3 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60"
              >
                {/* Official Google 'G' Icon */}
                <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                </div>
                <span>
                  {loading ? 'Connecting with Google...' : 'Sign in with Google'}
                </span>
              </button>

              <p className="text-[11px] text-[#8b716e] text-center leading-relaxed">
                Connect securely with one click using your Google account.
              </p>
            </div>
          ) : (
            /* Email and Password Tab */
            <form onSubmit={handleEmailSignIn} className="space-y-3 pt-1">
              {isRegister && (
                <div>
                  <label className="block text-[11px] font-semibold text-[#57423f] uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Elena Vance"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#dec0bc] focus:border-[#a4362d] focus:ring-2 focus:ring-[#ffdad5] text-xs text-[#181c1d] outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-semibold text-[#57423f] uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="traveler@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dec0bc] focus:border-[#a4362d] focus:ring-2 focus:ring-[#ffdad5] text-xs text-[#181c1d] outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#57423f] uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#dec0bc] focus:border-[#a4362d] focus:ring-2 focus:ring-[#ffdad5] text-xs text-[#181c1d] outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#a4362d] hover:bg-[#8b2d25] text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                ) : (
                  <span>{isRegister ? 'Create Account & Sign In' : 'Sign in with Password'}</span>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-[11px] text-[#57423f] hover:text-[#a4362d] underline font-medium"
                >
                  {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
                </button>
              </div>
            </form>
          )}

          {/* Feature Badges */}
          <div className="pt-4 border-t border-[#dec0bc]/40 grid grid-cols-2 gap-2 text-[11px] text-[#57423f]">
            <div className="flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-sm text-[#a4362d]">sync</span>
              <span>Sync Itineraries</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-sm text-[#a4362d]">shield</span>
              <span>Cloud Firestore</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-sm text-[#a4362d]">share</span>
              <span>Live Sharing</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-sm text-[#a4362d]">tune</span>
              <span>DNA Preferences</span>
            </div>
          </div>
        </div>

        {/* Guest fallback */}
        {onSkipAsGuest && (
          <div className="text-center mt-4">
            <button
              id="google-signin-guest-btn"
              onClick={onSkipAsGuest}
              className="text-xs text-[#8b716e] hover:text-[#181c1d] underline decoration-[#dec0bc] transition-colors"
            >
              Continue without signing in (Guest mode)
            </button>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="py-3 text-center text-[11px] text-[#8b716e] z-10 relative">
        <span>Protected by Firebase Authentication • TripBuilder Travel Curation</span>
      </footer>
    </div>
  );
};

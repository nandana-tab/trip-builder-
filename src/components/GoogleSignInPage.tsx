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
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-[#181c1d] selection:bg-[#a4362d] selection:text-white">
      {/* High-Resolution Travel & Cartography Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2400&q=85')`
        }}
      />

      {/* Atmospheric Overlays & Vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#181c1d]/75 via-[#181c1d]/60 to-[#181c1d]/90 backdrop-blur-[2px]" />
      
      {/* Decorative Radial Warm Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#a4362d]/25 rounded-full blur-3xl pointer-events-none -mt-48" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-[#dec0bc]/15 rounded-full blur-3xl pointer-events-none -mb-48" />

      {/* Subtle Topographic Grid & Coordinate Lines */}
      <div 
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Floating Travel Location Badges (Visible on larger screens for depth) */}
      <div className="hidden lg:flex absolute top-24 left-12 items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-white/90 text-xs shadow-lg animate-pulse">
        <span className="material-symbols-outlined text-sm text-[#ffdad5]">explore</span>
        <span className="font-mono tracking-wider text-[11px]">TOKYO • 35.6762° N, 139.6503° E</span>
      </div>

      <div className="hidden lg:flex absolute bottom-24 left-12 items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-white/90 text-xs shadow-lg">
        <span className="material-symbols-outlined text-sm text-[#ffdad5]">near_me</span>
        <span className="font-mono tracking-wider text-[11px]">AMALFI • 40.6340° N, 14.6027° E</span>
      </div>

      <div className="hidden lg:flex absolute top-28 right-12 items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-white/90 text-xs shadow-lg">
        <span className="material-symbols-outlined text-sm text-[#ffdad5]">flight</span>
        <span className="font-mono tracking-wider text-[11px]">PARIS • 48.8566° N, 2.3522° E</span>
      </div>

      <div className="hidden lg:flex absolute bottom-28 right-12 items-center space-x-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15 text-white/90 text-xs shadow-lg">
        <span className="material-symbols-outlined text-sm text-[#ffdad5]">pin_drop</span>
        <span className="font-mono tracking-wider text-[11px]">KYOTO • 35.0116° N, 135.7681° E</span>
      </div>

      {/* Top Navigation Header */}
      <header className="py-6 px-6 sm:px-12 flex items-center justify-between z-10 relative">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#a4362d] flex items-center justify-center text-white shadow-lg shadow-[#a4362d]/40 border border-white/20">
            <span className="material-symbols-outlined text-2xl">travel_explore</span>
          </div>
          <div>
            <span className="font-serif text-2xl font-bold tracking-tight text-white drop-shadow-sm block leading-none">
              TripBuilder
            </span>
            <span className="text-[10px] tracking-widest text-[#ffdad5]/80 uppercase font-medium mt-0.5 block">
              Bespoke Journey Curation
            </span>
          </div>
        </div>

        {onSkipAsGuest && (
          <button
            id="google-signin-skip-btn"
            onClick={onSkipAsGuest}
            className="text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 transition-all flex items-center space-x-1.5 shadow-md group"
          >
            <span>Explore as Guest</span>
            <span className="material-symbols-outlined text-base group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
          </button>
        )}
      </header>

      {/* Center Sign In Card */}
      <main className="max-w-md w-full mx-auto px-4 sm:px-6 my-auto z-10 relative py-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-7 sm:p-9 border border-white/60 shadow-2xl shadow-black/40 space-y-5">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-[#ffdad5] text-[#a4362d] flex items-center justify-center mx-auto mb-2 shadow-inner border border-[#a4362d]/10">
              <span className="material-symbols-outlined text-2xl">flight_takeoff</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#a4362d]">
              Welcome to TripBuilder
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181c1d] tracking-tight">
              Sign in to begin
            </h1>
            <p className="text-xs text-[#57423f] leading-relaxed">
              Curate bespoke travel itineraries, discover hidden gems, and sync your saved journeys across devices.
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-[#f7fafb] p-1 rounded-xl border border-[#dec0bc]/60">
            <button
              type="button"
              onClick={() => { setActiveTab('google'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'google'
                  ? 'bg-white text-[#181c1d] shadow-sm font-bold'
                  : 'text-[#8b716e] hover:text-[#181c1d]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">account_circle</span>
              <span>Google Account</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('email'); setError(''); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                activeTab === 'email'
                  ? 'bg-white text-[#181c1d] shadow-sm font-bold'
                  : 'text-[#8b716e] hover:text-[#181c1d]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">mail</span>
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
                className="w-full py-3.5 px-5 rounded-2xl border-2 border-[#dec0bc] bg-white hover:bg-[#ffdad5]/20 hover:border-[#a4362d] text-sm font-bold text-[#181c1d] transition-all flex items-center justify-center space-x-3 shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60 cursor-pointer"
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
                  {loading ? 'Connecting with Google...' : 'Continue with Google'}
                </span>
              </button>

              <p className="text-[11px] text-[#8b716e] text-center leading-relaxed">
                Instant secure sign-in with your Google account • No password required.
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
                className="w-full py-3 rounded-xl bg-[#a4362d] hover:bg-[#8b2d25] text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center space-x-2 mt-2 disabled:opacity-60 cursor-pointer"
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
              <span>Live Trip Sharing</span>
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
              className="text-xs text-white/80 hover:text-white underline decoration-white/40 hover:decoration-white transition-colors drop-shadow"
            >
              Continue without signing in (Guest mode)
            </button>
          </div>
        )}
      </main>

      {/* Footer info */}
      <footer className="py-4 text-center text-[11px] text-white/70 z-10 relative">
        <span>Protected by Firebase Authentication • TripBuilder Curated Expeditions</span>
      </footer>
    </div>
  );
};

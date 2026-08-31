import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTrip } from '../context/TripContext';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, tripId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const { trips, activeTripId, resetWizardDraft } = useTrip();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleStartNewTrip = () => {
    resetWizardDraft();
    onNavigate('wizard');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#f7fafb]/90 backdrop-blur-md border-b border-[#dec0bc]/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-8">
            <button
              id="brand-logo-btn"
              onClick={() => onNavigate('landing')}
              className="flex items-center space-x-2 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full bg-[#a4362d] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-xl">travel_explore</span>
              </div>
              <div>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#181c1d] group-hover:text-[#a4362d] transition-colors">
                  TripBuilder
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
              <button
                id="nav-explore-btn"
                onClick={() => onNavigate('landing')}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                  currentView === 'landing'
                    ? 'text-[#a4362d] bg-[#ffdad5]/50'
                    : 'text-[#57423f] hover:text-[#181c1d] hover:bg-[#dec0bc]/20'
                }`}
              >
                Destinations
              </button>

              <button
                id="nav-mytrips-btn"
                onClick={() => onNavigate('dashboard')}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all flex items-center space-x-1.5 ${
                  currentView === 'dashboard'
                    ? 'text-[#a4362d] bg-[#ffdad5]/50'
                    : 'text-[#57423f] hover:text-[#181c1d] hover:bg-[#dec0bc]/20'
                }`}
              >
                <span>My Journeys</span>
                {trips.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#a4362d] text-white font-semibold">
                    {trips.length}
                  </span>
                )}
              </button>

              {activeTripId && (
                <button
                  id="nav-itinerary-btn"
                  onClick={() => onNavigate('itinerary', activeTripId)}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all ${
                    currentView === 'itinerary' || currentView === 'recommendations' || currentView === 'summary'
                      ? 'text-[#a4362d] bg-[#ffdad5]/50'
                      : 'text-[#57423f] hover:text-[#181c1d] hover:bg-[#dec0bc]/20'
                  }`}
                >
                  Active Itinerary
                </button>
              )}
            </nav>
          </div>

          {/* Action CTA & User Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              id="header-plan-trip-cta"
              onClick={handleStartNewTrip}
              className="hidden sm:flex items-center space-x-1.5 px-4 py-2 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-sm font-semibold shadow-sm hover:shadow transition-all duration-200"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>Plan Trip</span>
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-toggle"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-[#dec0bc]/30 transition-colors focus:outline-none"
                  aria-expanded={isUserMenuOpen}
                >
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={user.displayName}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-[#dec0bc]"
                  />
                  <span className="hidden lg:inline text-xs font-semibold text-[#181c1d]">
                    {user.displayName}
                  </span>
                  <span className="material-symbols-outlined text-sm text-[#8b716e]">expand_more</span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#dec0bc]/60 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-[#dec0bc]/30">
                      <p className="text-xs text-[#8b716e]">Signed in as</p>
                      <p className="text-sm font-semibold text-[#181c1d] truncate">{user.displayName}</p>
                      <p className="text-xs text-[#57423f] truncate">{user.email}</p>
                    </div>

                    <button
                      id="dropdown-my-trips"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#181c1d] hover:bg-[#ffdad5]/30 flex items-center space-x-2"
                    >
                      <span className="material-symbols-outlined text-base text-[#a4362d]">luggage</span>
                      <span>My Journeys ({trips.length})</span>
                    </button>

                    <button
                      id="dropdown-new-trip"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        handleStartNewTrip();
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#181c1d] hover:bg-[#ffdad5]/30 flex items-center space-x-2"
                    >
                      <span className="material-symbols-outlined text-base text-[#a4362d]">add_location_alt</span>
                      <span>Plan New Trip</span>
                    </button>

                    <div className="border-t border-[#dec0bc]/30 my-1"></div>

                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                        onNavigate('login');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-[#ba1a1a] hover:bg-[#ffdad5]/30 flex items-center space-x-2"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  id="header-google-signin-btn"
                  onClick={() => onNavigate('login')}
                  className="hidden sm:flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-[#dec0bc] bg-white hover:bg-[#ffdad5]/20 text-xs font-semibold text-[#181c1d] transition-all shadow-xs"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
                  <span>Google Sign In</span>
                </button>
                <button
                  id="header-signin-btn"
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 rounded-full border border-[#a4362d] text-[#a4362d] hover:bg-[#a4362d] hover:text-white text-sm font-semibold transition-all duration-200"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              id="mobile-nav-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#57423f] hover:bg-[#dec0bc]/20"
            >
              <span className="material-symbols-outlined">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#dec0bc] px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <button
            onClick={() => {
              onNavigate('landing');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-[#181c1d] hover:bg-[#ffdad5]/40 flex items-center space-x-2"
          >
            <span className="material-symbols-outlined text-[#a4362d]">explore</span>
            <span>Explore Destinations</span>
          </button>

          <button
            onClick={() => {
              onNavigate('dashboard');
              setIsMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-[#181c1d] hover:bg-[#ffdad5]/40 flex items-center justify-between"
          >
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#a4362d]">luggage</span>
              <span>My Journeys</span>
            </div>
            {trips.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#a4362d] text-white">
                {trips.length}
              </span>
            )}
          </button>

          {activeTripId && (
            <button
              onClick={() => {
                onNavigate('itinerary', activeTripId);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-[#181c1d] hover:bg-[#ffdad5]/40 flex items-center space-x-2"
            >
              <span className="material-symbols-outlined text-[#a4362d]">map</span>
              <span>Active Itinerary</span>
            </button>
          )}

          <div className="pt-2">
            <button
              onClick={handleStartNewTrip}
              className="w-full py-2.5 rounded-full bg-[#a4362d] text-white text-sm font-semibold flex items-center justify-center space-x-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span>Plan New Trip</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

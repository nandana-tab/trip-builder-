import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider, useTrip } from './context/TripContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { GoogleSignInPage } from './components/GoogleSignInPage';
import { LandingPage } from './components/LandingPage';
import { WizardContainer } from './components/Wizard/WizardContainer';
import { CuratingAnimation } from './components/CuratingAnimation';
import { RecommendationsView } from './components/RecommendationsView';
import { ItineraryView } from './components/ItineraryView';
import { TripSummaryView } from './components/TripSummaryView';
import { MyTripsDashboard } from './components/MyTripsDashboard';
import { SharedTripView } from './components/SharedTripView';

type ViewType =
  | 'login'
  | 'landing'
  | 'wizard'
  | 'curating'
  | 'recommendations'
  | 'itinerary'
  | 'summary'
  | 'dashboard'
  | 'shared';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [currentView, setCurrentView] = useState<ViewType>(() => {
    // Check if initial hash is a shared trip
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#share/')) {
      return 'shared';
    }
    // If not authenticated, start with the Google sign-in page at the beginning
    const stored = localStorage.getItem('tripbuilder_auth_user');
    return stored ? 'landing' : 'login';
  });
  const [sharedTripId, setSharedTripId] = useState<string | null>(null);
  const [wizardInitialStep, setWizardInitialStep] = useState<number>(1);
  const { setActiveTripId, activeTripId } = useTrip();

  // Listen to window hash changes for direct deep linking (#share/trip-id)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#share/')) {
        const id = hash.replace('#share/', '');
        setSharedTripId(id);
        setCurrentView('shared');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (view: string, tripId?: string) => {
    if (tripId) {
      setActiveTripId(tripId);
    }
    if (view === 'shared') {
      window.location.hash = `#share/${tripId || activeTripId || ''}`;
    } else {
      window.location.hash = '';
    }
    if (view === 'wizard') {
      setWizardInitialStep(1);
    }
    setCurrentView(view as ViewType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on login view, render the dedicated full-screen Google Sign In Page
  if (currentView === 'login') {
    return (
      <GoogleSignInPage
        onSuccess={() => {
          setCurrentView('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSkipAsGuest={() => {
          setCurrentView('landing');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafb] text-[#181c1d]">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      <AuthModal />

      <div className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartWizard={(dest, initialStep = 1) => {
              setWizardInitialStep(initialStep);
              setCurrentView('wizard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onExploreTrip={(tripId) => {
              setActiveTripId(tripId);
              setCurrentView('itinerary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'wizard' && (
          <WizardContainer
            key={`wizard-step-${wizardInitialStep}`}
            initialStep={wizardInitialStep}
            onComplete={() => {
              setCurrentView('curating');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onCancel={() => {
              setCurrentView('landing');
            }}
          />
        )}

        {currentView === 'curating' && (
          <CuratingAnimation
            onComplete={() => {
              setCurrentView('recommendations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'recommendations' && (
          <RecommendationsView
            onNavigateToItinerary={() => {
              setCurrentView('itinerary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'itinerary' && (
          <ItineraryView
            onNavigateToSummary={() => {
              setCurrentView('summary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToRecommendations={() => {
              setCurrentView('recommendations');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onShareTrip={() => {
              setCurrentView('summary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'summary' && (
          <TripSummaryView
            onBackToItinerary={() => {
              setCurrentView('itinerary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateToDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <MyTripsDashboard
            onOpenTrip={(id) => {
              setActiveTripId(id);
              setCurrentView('itinerary');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartNewTrip={() => {
              setCurrentView('wizard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'shared' && sharedTripId && (
          <SharedTripView
            tripId={sharedTripId}
            onPlanYourOwn={() => {
              setCurrentView('landing');
              window.location.hash = '';
            }}
          />
        )}
      </div>

      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <AppContent />
      </TripProvider>
    </AuthProvider>
  );
}

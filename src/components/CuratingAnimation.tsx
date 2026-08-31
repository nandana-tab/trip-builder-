import React, { useState, useEffect } from 'react';
import { useTrip } from '../context/TripContext';

interface CuratingAnimationProps {
  onComplete: () => void;
}

export const CuratingAnimation: React.FC<CuratingAnimationProps> = ({ onComplete }) => {
  const { wizardDraft } = useTrip();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = [
    { label: `Analyzing ${wizardDraft.destination} Travel DNA & culinary preferences`, icon: 'psychology' },
    { label: 'Sourcing authentic neighborhood attractions, stays & hidden gems', icon: 'travel_explore' },
    { label: `Cross-referencing ${wizardDraft.fine_tune.pace.toLowerCase()} pacing and optimal time slots`, icon: 'timelapse' },
    { label: `Balancing estimated costs against $${wizardDraft.total_budget_usd.toLocaleString()} budget`, icon: 'account_balance_wallet' },
    { label: 'Crafting your personalized day-by-day itinerary canvas', icon: 'auto_awesome' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 800);
          return prev;
        }
      });
    }, 700);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#f7fafb] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#dec0bc]/80 shadow-2xl text-center relative overflow-hidden">
        {/* Animated Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#ffdad5]/50 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#dec0bc]/40 blur-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-[#ffdad5] text-[#a4362d] flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
            <span className="material-symbols-outlined text-3xl">travel_explore</span>
          </div>

          <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d]">
            Traveler Community Curation Engine
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181c1d] mt-2 mb-2">
            Curating your {wizardDraft.destination} Odyssey...
          </h2>
          <p className="text-xs text-[#57423f] mb-8">
            Tailoring {wizardDraft.duration_days} days for {wizardDraft.travel_group.size} traveler{wizardDraft.travel_group.size > 1 ? 's' : ''}
          </p>

          {/* Sequential Animated Steps */}
          <div className="space-y-4 text-left">
            {steps.map((step, idx) => {
              const isDone = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={idx}
                  className={`flex items-center space-x-3 p-3 rounded-2xl transition-all duration-300 ${
                    isCurrent
                      ? 'bg-[#ffdad5]/40 border border-[#a4362d]/40 scale-[1.02]'
                      : isDone
                      ? 'bg-[#f7fafb] opacity-80'
                      : 'opacity-40'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isDone
                        ? 'bg-[#a4362d] text-white'
                        : isCurrent
                        ? 'bg-[#ffdad5] text-[#a4362d] animate-spin'
                        : 'bg-[#dec0bc]/40 text-[#8b716e]'
                    }`}
                  >
                    {isDone ? (
                      <span className="material-symbols-outlined text-base">check</span>
                    ) : isCurrent ? (
                      <span className="material-symbols-outlined text-base">progress_activity</span>
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs sm:text-sm font-medium ${
                      isCurrent ? 'text-[#181c1d] font-bold' : isDone ? 'text-[#57423f]' : 'text-[#8b716e]'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-[#dec0bc]/40 flex items-center justify-center space-x-2 text-xs text-[#8b716e]">
            <span className="material-symbols-outlined text-sm text-[#a4362d]">shield</span>
            <span>Ground-truth vetted recommendations only</span>
          </div>
        </div>
      </div>
    </div>
  );
};

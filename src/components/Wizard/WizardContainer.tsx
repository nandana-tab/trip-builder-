import React, { useState } from 'react';
import { Step1Destination } from './Step1Destination';
import { Step2Dates } from './Step2Dates';
import { Step3Group } from './Step3Group';
import { Step4Budget } from './Step4Budget';
import { Step5DNA } from './Step5DNA';
import { Step6Food } from './Step6Food';
import { Step7FineTune } from './Step7FineTune';
import { useTrip } from '../../context/TripContext';
import { formatCurrency } from '../../utils/currency';

interface WizardContainerProps {
  initialStep?: number;
  onComplete: () => void;
  onCancel: () => void;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({ initialStep = 1, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const { wizardDraft, createTripFromDraft } = useTrip();

  const totalSteps = 7;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      createTripFromDraft();
      onComplete();
    }
  };

  const handleSkipFood = () => {
    setCurrentStep(7);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onCancel();
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fafb] pb-24 w-full max-w-full overflow-x-hidden">
      {/* Top Wizard Progress Bar - cleanly styled with clear visibility */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#dec0bc]/50 z-20 shadow-2xs w-full">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <button
              id="wizard-top-back-btn"
              onClick={handleBack}
              className="flex items-center space-x-1 text-xs font-semibold text-[#57423f] hover:text-[#a4362d] transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>{currentStep === 1 ? 'Exit Setup' : 'Previous Step'}</span>
            </button>

            <span className="text-xs font-bold uppercase tracking-wider text-[#a4362d]">
              Step {currentStep} of {totalSteps}
            </span>

            <button
              id="wizard-save-exit-btn"
              onClick={onCancel}
              className="text-xs font-semibold text-[#8b716e] hover:text-[#181c1d] cursor-pointer"
            >
              Save & Exit
            </button>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-[#dec0bc]/30 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#a4362d] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Step Content with spacious top padding to guarantee visible headers */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-8 sm:pt-10 pb-36 sm:pb-32 w-full max-w-full overflow-x-hidden">
        {currentStep === 1 && <Step1Destination onNext={handleNext} />}
        {currentStep === 2 && <Step2Dates />}
        {currentStep === 3 && <Step3Group />}
        {currentStep === 4 && <Step4Budget />}
        {currentStep === 5 && <Step5DNA />}
        {currentStep === 6 && <Step6Food onSkip={handleSkipFood} onNext={handleNext} />}
        {currentStep === 7 && <Step7FineTune />}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#dec0bc]/80 py-3 sm:py-4 px-3 sm:px-8 z-30 shadow-lg pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              id="wizard-bottom-back-btn"
              onClick={handleBack}
              className="px-4 sm:px-6 py-2.5 rounded-full border border-[#dec0bc] text-[#57423f] hover:bg-[#ffdad5]/30 text-xs sm:text-sm font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base sm:text-lg">arrow_back</span>
              <span>Back</span>
            </button>

            {currentStep === 6 && (
              <button
                id="wizard-bottom-skip-food-btn"
                type="button"
                onClick={handleSkipFood}
                className="hidden sm:flex text-xs font-semibold text-[#8b716e] hover:text-[#a4362d] underline decoration-[#dec0bc] transition-colors items-center space-x-1"
              >
                <span>Skip dining preferences</span>
              </button>
            )}
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-[#57423f]">
            <span className="font-semibold">{wizardDraft.destination}</span>
            <span>•</span>
            <span>{wizardDraft.duration_days} Days</span>
            <span>•</span>
            <span className="font-bold text-[#a4362d]">
              {formatCurrency(wizardDraft.total_budget_usd, wizardDraft.currency)}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {currentStep === 6 && (
              <button
                id="wizard-bottom-mobile-skip-btn"
                type="button"
                onClick={handleSkipFood}
                className="sm:hidden px-3 py-2.5 rounded-full border border-[#dec0bc] text-xs font-semibold text-[#57423f] hover:bg-[#ffdad5]/30"
              >
                Skip
              </button>
            )}
            <button
              id="wizard-bottom-continue-btn"
              onClick={handleNext}
              className="px-5 sm:px-8 py-2.5 sm:py-3 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs sm:text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 sm:space-x-2 cursor-pointer whitespace-nowrap"
            >
              <span>{currentStep === totalSteps ? 'Curate My Itinerary' : 'Continue'}</span>
              <span className="material-symbols-outlined text-base sm:text-lg">
                {currentStep === totalSteps ? 'auto_awesome' : 'arrow_forward'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


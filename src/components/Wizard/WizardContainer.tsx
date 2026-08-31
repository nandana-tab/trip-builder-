import React, { useState } from 'react';
import { Step1Destination } from './Step1Destination';
import { Step2Dates } from './Step2Dates';
import { Step3Group } from './Step3Group';
import { Step4Budget } from './Step4Budget';
import { Step5DNA } from './Step5DNA';
import { Step6FineTune } from './Step6FineTune';
import { useTrip } from '../../context/TripContext';

interface WizardContainerProps {
  initialStep?: number;
  onComplete: () => void;
  onCancel: () => void;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({ initialStep = 1, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const { wizardDraft, createTripFromDraft } = useTrip();

  const totalSteps = 6;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      createTripFromDraft();
      onComplete();
    }
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
    <div className="min-h-screen bg-[#f7fafb] pb-24">
      {/* Top Wizard Progress Bar */}
      <div className="bg-white border-b border-[#dec0bc]/50 sticky top-18 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <button
              id="wizard-top-back-btn"
              onClick={handleBack}
              className="flex items-center space-x-1 text-xs font-semibold text-[#57423f] hover:text-[#a4362d] transition-colors"
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
              className="text-xs font-semibold text-[#8b716e] hover:text-[#181c1d]"
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

      {/* Main Step Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {currentStep === 1 && <Step1Destination onNext={handleNext} />}
        {currentStep === 2 && <Step2Dates />}
        {currentStep === 3 && <Step3Group />}
        {currentStep === 4 && <Step4Budget />}
        {currentStep === 5 && <Step5DNA />}
        {currentStep === 6 && <Step6FineTune />}
      </main>

      {/* Floating Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#dec0bc]/80 py-4 px-4 sm:px-8 z-30 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            id="wizard-bottom-back-btn"
            onClick={handleBack}
            className="px-6 py-2.5 rounded-full border border-[#dec0bc] text-[#57423f] hover:bg-[#ffdad5]/30 text-sm font-semibold transition-colors flex items-center space-x-1"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Back</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-xs text-[#57423f]">
            <span className="font-semibold">{wizardDraft.destination}</span>
            <span>•</span>
            <span>{wizardDraft.duration_days} Days</span>
            <span>•</span>
            <span>${wizardDraft.total_budget_usd.toLocaleString()}</span>
          </div>

          <button
            id="wizard-bottom-continue-btn"
            onClick={handleNext}
            className="px-8 py-3 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
          >
            <span>{currentStep === totalSteps ? 'Curate My Itinerary' : 'Continue'}</span>
            <span className="material-symbols-outlined text-lg">
              {currentStep === totalSteps ? 'auto_awesome' : 'arrow_forward'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

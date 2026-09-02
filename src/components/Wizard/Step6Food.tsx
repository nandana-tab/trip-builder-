import React from 'react';
import { useTrip } from '../../context/TripContext';
import { DIETARY_OPTIONS, CUISINE_STYLE_OPTIONS } from '../../data/foodPreferences';

interface Step6FoodProps {
  onSkip?: () => void;
  onNext?: () => void;
}

export const Step6Food: React.FC<Step6FoodProps> = ({ onSkip, onNext }) => {
  const { wizardDraft, updateWizardDraft } = useTrip();

  const currentPrefs = wizardDraft.food_preferences || {
    dietary: ['non_veg'],
    cuisines: ['local_authentic', 'cafes_bakeries'],
    custom_notes: '',
    is_skipped: false
  };

  const handleToggleDietary = (id: string) => {
    let newDietary = [...(currentPrefs.dietary || [])];

    if (newDietary.includes(id)) {
      newDietary = newDietary.filter(d => d !== id);
    } else {
      newDietary.push(id);
    }

    updateWizardDraft({
      food_preferences: {
        ...currentPrefs,
        dietary: newDietary,
        is_skipped: false
      }
    });
  };

  const handleToggleCuisine = (id: string) => {
    let newCuisines = [...(currentPrefs.cuisines || [])];
    if (newCuisines.includes(id)) {
      newCuisines = newCuisines.filter(c => c !== id);
    } else {
      newCuisines.push(id);
    }

    updateWizardDraft({
      food_preferences: {
        ...currentPrefs,
        cuisines: newCuisines,
        is_skipped: false
      }
    });
  };

  const handleNotesChange = (notes: string) => {
    updateWizardDraft({
      food_preferences: {
        ...currentPrefs,
        custom_notes: notes,
        is_skipped: false
      }
    });
  };

  const handleSkipThisStep = () => {
    updateWizardDraft({
      food_preferences: {
        dietary: [],
        cuisines: ['local_authentic'],
        custom_notes: '',
        is_skipped: true
      }
    });
    if (onSkip) {
      onSkip();
    } else if (onNext) {
      onNext();
    }
  };

  const handleSelectAllCuisines = () => {
    updateWizardDraft({
      food_preferences: {
        ...currentPrefs,
        cuisines: CUISINE_STYLE_OPTIONS.map(c => c.id),
        is_skipped: false
      }
    });
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pt-1 sm:pt-2">
      {/* Step Header with Instant Skip Option */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#dec0bc]/50 pb-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d] inline-block mb-1">
            Step 6 of 7
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d] leading-tight">
            Food & Dining Preferences
          </h2>
          <p className="text-sm text-[#57423f] mt-1.5 max-w-xl">
            Choose your dietary lifestyle, favorite cuisines, and dining styles so we can curate matching bistros and markets.
          </p>
        </div>

        <button
          id="skip-food-preferences-header-btn"
          type="button"
          onClick={handleSkipThisStep}
          className="self-start sm:self-auto px-4 py-2 rounded-full border border-[#dec0bc] bg-white hover:bg-[#ffdad5]/30 text-[#57423f] hover:text-[#a4362d] text-xs font-semibold transition-all flex items-center space-x-1.5 shadow-xs shrink-0 cursor-pointer"
        >
          <span>Skip for now (Open to all)</span>
          <span className="material-symbols-outlined text-sm">fast_forward</span>
        </button>
      </div>

      {/* Section 1: Dietary Requirements & Lifestyles */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dec0bc]/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#a4362d]">restaurant</span>
              <h3 className="font-serif text-lg font-bold text-[#181c1d]">
                Dietary Lifestyles & Preferences
              </h3>
            </div>
            <p className="text-xs text-[#57423f] mt-0.5">
              Select all options for you and your group (e.g. choose both Vegetarian and Non-Vegetarian if you have mixed dietary needs).
            </p>
          </div>

          <span className="text-[11px] font-semibold text-[#a4362d] bg-[#ffdad5]/50 px-2.5 py-1 rounded-full border border-[#dec0bc]/60 hidden sm:inline">
            Group Multi-Select Enabled
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {DIETARY_OPTIONS.map(opt => {
            const isSelected = (currentPrefs.dietary || []).includes(opt.id);

            return (
              <div
                key={opt.id}
                id={`dietary-opt-${opt.id}`}
                onClick={() => handleToggleDietary(opt.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between relative select-none ${
                  isSelected
                    ? 'border-[#a4362d] bg-[#ffdad5]/35 shadow-xs ring-1 ring-[#a4362d]/20'
                    : 'border-[#dec0bc]/50 bg-[#f7fafb]/60 hover:bg-white hover:border-[#dec0bc]'
                }`}
              >
                <div className="flex items-start space-x-3.5 pr-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#a4362d] text-white shadow-xs'
                        : 'bg-white text-[#57423f] border border-[#dec0bc]/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{opt.icon}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm text-[#181c1d]">
                        {opt.label}
                      </h4>
                    </div>
                    <p className="text-[11px] text-[#57423f] mt-0.5 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isSelected
                      ? 'border-[#a4362d] bg-[#a4362d] text-white'
                      : 'border-[#dec0bc] bg-white'
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Preferred Cuisines & Dining Ambience */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dec0bc]/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#a4362d]">ramen_dining</span>
              <h3 className="font-serif text-lg font-bold text-[#181c1d]">
                Favorite Dining Vibes & Cuisines
              </h3>
            </div>
            <p className="text-xs text-[#57423f] mt-0.5">
              What culinary atmospheres and flavors are you most excited to experience?
            </p>
          </div>

          <button
            type="button"
            onClick={handleSelectAllCuisines}
            className="text-xs text-[#a4362d] hover:text-[#8b2d25] font-semibold underline decoration-[#dec0bc] cursor-pointer"
          >
            Select All
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          {CUISINE_STYLE_OPTIONS.map(opt => {
            const isSelected = (currentPrefs.cuisines || []).includes(opt.id);

            return (
              <div
                key={opt.id}
                id={`cuisine-opt-${opt.id}`}
                onClick={() => handleToggleCuisine(opt.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start justify-between relative select-none ${
                  isSelected
                    ? 'border-[#a4362d] bg-[#ffdad5]/35 shadow-xs ring-1 ring-[#a4362d]/20'
                    : 'border-[#dec0bc]/50 bg-[#f7fafb]/60 hover:bg-white hover:border-[#dec0bc]'
                }`}
              >
                <div className="flex items-start space-x-3.5 pr-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-[#a4362d] text-white shadow-xs'
                        : 'bg-white text-[#57423f] border border-[#dec0bc]/50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{opt.icon}</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-sm text-[#181c1d]">
                        {opt.label}
                      </h4>
                      <span className="text-[9px] font-bold text-[#8b716e] uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded-md border border-[#dec0bc]/40">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#57423f] mt-0.5 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    isSelected
                      ? 'border-[#a4362d] bg-[#a4362d] text-white'
                      : 'border-[#dec0bc] bg-white'
                  }`}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined text-xs font-bold">check</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Custom Allergies or Notes */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dec0bc]/80 shadow-xs space-y-3">
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-[#a4362d]">notes</span>
          <h3 className="font-serif text-base font-bold text-[#181c1d]">
            Allergies, Dislikes or Specific Culinary Wishlist (Optional)
          </h3>
        </div>
        <p className="text-xs text-[#57423f]">
          Let us know any food allergies (e.g. peanuts, shellfish), dietary sensitivities, or specific dishes you want to try.
        </p>

        <textarea
          id="food-preferences-custom-notes"
          rows={2}
          value={currentPrefs.custom_notes || ''}
          onChange={e => handleNotesChange(e.target.value)}
          placeholder="e.g., Severe peanut allergy, avoid cilantro, seeking authentic tonkotsu ramen counters and rooftop tea lounges..."
          className="w-full text-xs p-3.5 rounded-2xl border border-[#dec0bc] bg-[#f7fafb] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a4362d] text-[#181c1d] placeholder:text-[#8b716e]/70"
        />
      </div>

      {/* Friendly Skip Banner at bottom */}
      <div className="p-4 rounded-2xl bg-[#f7fafb] border border-[#dec0bc]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#57423f]">
        <div className="flex items-center space-x-2.5">
          <span className="material-symbols-outlined text-[#a4362d] text-lg">info</span>
          <span>
            You can always modify your dining selections or filter restaurants in the itinerary canvas later.
          </span>
        </div>

        <button
          id="skip-food-preferences-footer-btn"
          type="button"
          onClick={handleSkipThisStep}
          className="text-xs font-bold text-[#a4362d] hover:text-[#8b2d25] underline decoration-[#dec0bc] shrink-0 cursor-pointer"
        >
          Skip & Keep Open to Everything
        </button>
      </div>
    </div>
  );
};

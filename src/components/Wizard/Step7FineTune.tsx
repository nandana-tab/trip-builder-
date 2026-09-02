import React from 'react';
import { useTrip } from '../../context/TripContext';
import { ItineraryPace } from '../../types';

export const Step7FineTune: React.FC = () => {
  const { wizardDraft, updateWizardDraft } = useTrip();

  const handleFineTuneChange = (
    key: 'accommodations' | 'dining' | 'activities',
    value: number
  ) => {
    updateWizardDraft({
      fine_tune: {
        ...wizardDraft.fine_tune,
        [key]: value
      }
    });
  };

  const handlePaceChange = (pace: ItineraryPace) => {
    updateWizardDraft({
      fine_tune: {
        ...wizardDraft.fine_tune,
        pace
      }
    });
  };

  const getAccomLabel = (v: number) => {
    switch (v) {
      case 1: return 'Budget Stays & Hostels';
      case 2: return 'Cozy Guesthouses & B&Bs';
      case 3: return 'Boutique Design Hotels';
      case 4: return '4-Star Upscale Stays';
      case 5: return '5-Star Luxury Sanctuaries & Ryokans';
      default: return 'Boutique Design Hotels';
    }
  };

  const getDiningLabel = (v: number) => {
    switch (v) {
      case 1: return 'Street Food & Neighborhood Markets';
      case 2: return 'Casual Bistros & Local Izakayas';
      case 3: return 'Celebrated Local Favorites';
      case 4: return 'Upscale Chef-driven Dining';
      case 5: return 'Michelin Star & Multi-Course Omakase';
      default: return 'Celebrated Local Favorites';
    }
  };

  const getActivitiesLabel = (v: number) => {
    switch (v) {
      case 1: return 'Self-guided & Free Walkabouts';
      case 2: return 'Public Landmarks & Parks';
      case 3: return 'Small-Group Guided Tours & Passes';
      case 4: return 'Special Access & Masterclasses';
      case 5: return 'Private VIP Charters & Exclusive Access';
      default: return 'Small-Group Guided Tours';
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pt-1 sm:pt-2">
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d] inline-block mb-1">
          Step 7 of 7
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d] leading-tight">
          Fine-tune the details
        </h2>
        <p className="text-sm text-[#57423f] mt-2">
          Adjust budget allocation priorities and daily rhythm to match your travel style.
        </p>
      </div>

      {/* Itinerary Pace Selector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dec0bc]/80 shadow-sm space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#57423f]">
          Daily Itinerary Pace
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              pace: 'Relaxed' as ItineraryPace,
              icon: 'bedtime',
              label: 'Relaxed',
              desc: '1–2 items / day. Long lazy lunches, slow mornings & spontaneous strolls.'
            },
            {
              pace: 'Moderate' as ItineraryPace,
              icon: 'timelapse',
              label: 'Moderate',
              desc: '3–4 items / day. Harmonious mix of highlights, dining & downtime.'
            },
            {
              pace: 'Packed' as ItineraryPace,
              icon: 'speed',
              label: 'Packed',
              desc: '5+ items / day. Maximized sightseeing from dawn to late evening.'
            }
          ].map(p => {
            const isSelected = wizardDraft.fine_tune.pace === p.pace;
            return (
              <button
                key={p.pace}
                id={`pace-btn-${p.pace.toLowerCase()}`}
                type="button"
                onClick={() => handlePaceChange(p.pace)}
                className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'border-[#a4362d] bg-[#ffdad5]/30 shadow-sm'
                    : 'border-[#dec0bc]/60 bg-white hover:border-[#dec0bc]'
                }`}
              >
                <div>
                  <span className="material-symbols-outlined text-2xl text-[#a4362d] mb-2">
                    {p.icon}
                  </span>
                  <p className="font-serif font-bold text-base text-[#181c1d]">{p.label}</p>
                </div>
                <p className="text-[11px] text-[#57423f] mt-2 leading-relaxed">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sliders Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dec0bc]/80 shadow-sm space-y-8">
        {/* Accommodations Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#a4362d]">hotel</span>
              <span className="text-sm font-bold text-[#181c1d]">Accommodations Priority</span>
            </div>
            <span className="text-xs font-semibold text-[#a4362d] bg-[#ffdad5]/60 px-2.5 py-1 rounded-full">
              {getAccomLabel(wizardDraft.fine_tune.accommodations)}
            </span>
          </div>
          <p className="text-xs text-[#57423f]">
            Weight from budget boutique hostels (1) to ultra-luxury 5-star ryokans & suites (5).
          </p>
          <input
            id="slider-accommodations"
            type="range"
            min={1}
            max={5}
            step={1}
            value={wizardDraft.fine_tune.accommodations}
            onChange={e => handleFineTuneChange('accommodations', parseInt(e.target.value))}
            className="w-full accent-[#a4362d] cursor-pointer h-2 bg-[#dec0bc]/40 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-semibold text-[#8b716e]">
            <span>1 (Budget Stay)</span>
            <span>3 (Boutique Hotel)</span>
            <span>5 (Ultra Luxury)</span>
          </div>
        </div>

        {/* Dining Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#a4362d]">restaurant</span>
              <span className="text-sm font-bold text-[#181c1d]">Dining & Gastronomy Priority</span>
            </div>
            <span className="text-xs font-semibold text-[#a4362d] bg-[#ffdad5]/60 px-2.5 py-1 rounded-full">
              {getDiningLabel(wizardDraft.fine_tune.dining)}
            </span>
          </div>
          <p className="text-xs text-[#57423f]">
            Weight from vibrant street food stalls (1) to Michelin-starred multi-course tasting menus (5).
          </p>
          <input
            id="slider-dining"
            type="range"
            min={1}
            max={5}
            step={1}
            value={wizardDraft.fine_tune.dining}
            onChange={e => handleFineTuneChange('dining', parseInt(e.target.value))}
            className="w-full accent-[#a4362d] cursor-pointer h-2 bg-[#dec0bc]/40 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-semibold text-[#8b716e]">
            <span>1 (Street Food)</span>
            <span>3 (Local Favorite)</span>
            <span>5 (Michelin Star)</span>
          </div>
        </div>

        {/* Activities Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#a4362d]">explore</span>
              <span className="text-sm font-bold text-[#181c1d]">Activities & Passes Priority</span>
            </div>
            <span className="text-xs font-semibold text-[#a4362d] bg-[#ffdad5]/60 px-2.5 py-1 rounded-full">
              {getActivitiesLabel(wizardDraft.fine_tune.activities)}
            </span>
          </div>
          <p className="text-xs text-[#57423f]">
            Weight from self-guided walks (1) to VIP private charter tours and workshops (5).
          </p>
          <input
            id="slider-activities"
            type="range"
            min={1}
            max={5}
            step={1}
            value={wizardDraft.fine_tune.activities}
            onChange={e => handleFineTuneChange('activities', parseInt(e.target.value))}
            className="w-full accent-[#a4362d] cursor-pointer h-2 bg-[#dec0bc]/40 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-semibold text-[#8b716e]">
            <span>1 (Self Guided)</span>
            <span>3 (Guided Tours)</span>
            <span>5 (Private VIP)</span>
          </div>
        </div>
      </div>

      {/* Summary Box */}
      <div className="p-5 rounded-3xl bg-[#ffdad5]/30 border border-[#dec0bc] flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="material-symbols-outlined text-2xl text-[#a4362d]">auto_awesome</span>
          <div>
            <span className="font-bold text-[#181c1d] block">
              Algorithm Ready for Curation
            </span>
            <span className="text-[#57423f]">
              We will match the top attractions, dining tables, and scenic spots in {wizardDraft.destination} to this exact blueprint.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { POPULAR_DESTINATIONS, DestinationInfo } from '../../data/seedData';
import { useTrip } from '../../context/TripContext';
import { getDestinationDailyAvgUSD } from '../../utils/destinationCost';

interface Step1Props {
  onNext: () => void;
}

export const Step1Destination: React.FC<Step1Props> = ({ onNext }) => {
  const { wizardDraft, updateWizardDraft } = useTrip();
  const [search, setSearch] = useState('');
  const [customCity, setCustomCity] = useState('');

  const filtered = POPULAR_DESTINATIONS.filter(
    d =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.country.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (dest: DestinationInfo) => {
    const dailyAvg = getDestinationDailyAvgUSD(
      dest.name,
      dest.country,
      wizardDraft.budget_tier || 'mid-range'
    );
    const totalUSD = dailyAvg * wizardDraft.duration_days * wizardDraft.travel_group.size;
    updateWizardDraft({
      destination: dest.name,
      destination_country: dest.country,
      destination_image: dest.image,
      total_budget_usd: Math.max(20, totalUSD)
    });
  };

  const handleApplyCustom = () => {
    if (!customCity.trim()) return;
    const dailyAvg = getDestinationDailyAvgUSD(
      customCity.trim(),
      'Global',
      wizardDraft.budget_tier || 'mid-range'
    );
    const totalUSD = dailyAvg * wizardDraft.duration_days * wizardDraft.travel_group.size;
    updateWizardDraft({
      destination: customCity.trim(),
      destination_country: 'Global',
      destination_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
      total_budget_usd: Math.max(20, totalUSD)
    });
    setCustomCity('');
  };

  return (
    <div className="space-y-6 pt-1 sm:pt-2">
      <div className="text-center max-w-xl mx-auto mb-6 sm:mb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d] inline-block mb-1">
          Step 1 of 7
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d] leading-tight">
          Where do you wanna go?
        </h2>
        <p className="text-sm text-[#57423f] mt-2">
          Select a curated global destination or specify any city worldwide.
        </p>
      </div>

      {/* Search and custom input */}
      <div className="max-w-xl mx-auto flex gap-2">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3.5 top-3 text-[#8b716e]">
            search
          </span>
          <input
            id="wizard-dest-search-input"
            type="text"
            placeholder="Search featured destinations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[#dec0bc] focus:border-[#a4362d] focus:ring-2 focus:ring-[#ffdad5] text-sm text-[#181c1d] bg-white outline-none"
          />
        </div>
      </div>

      {/* Selected destination banner */}
      <div className="max-w-2xl mx-auto p-4 rounded-2xl bg-[#ffdad5]/30 border border-[#dec0bc] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="material-symbols-outlined text-[#a4362d] text-2xl">
            location_on
          </span>
          <div>
            <p className="text-xs text-[#8b716e] font-semibold uppercase">Currently Selected</p>
            <p className="text-base font-bold text-[#181c1d]">
              {wizardDraft.destination}, {wizardDraft.destination_country}
            </p>
          </div>
        </div>
        <button
          id="wizard-step1-confirm-btn"
          onClick={onNext}
          className="px-5 py-2 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1"
        >
          <span>Continue</span>
          <span className="material-symbols-outlined text-base">arrow_forward</span>
        </button>
      </div>

      {/* Destination Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {filtered.map(dest => {
          const isSelected = wizardDraft.destination === dest.name;
          return (
            <div
              key={dest.name}
              id={`dest-card-${dest.name.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleSelect(dest)}
              className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                isSelected
                  ? 'border-[#a4362d] ring-4 ring-[#ffdad5] shadow-lg scale-[1.02]'
                  : 'border-transparent hover:border-[#dec0bc] shadow-sm hover:shadow-md'
              }`}
            >
              <div className="h-40 overflow-hidden relative">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-[#a4362d] text-white flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="font-serif text-lg font-bold">{dest.name}</h4>
                  <p className="text-xs text-[#ffdad5]">{dest.country}</p>
                </div>
              </div>
              <div className="p-3 bg-white text-xs text-[#57423f] flex items-center justify-between border-t border-[#dec0bc]/30">
                <span className="truncate">{dest.bestSeason}</span>
                <span className="font-bold text-[#a4362d] whitespace-nowrap">~${dest.avgDailyBudget}/d</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom City input option */}
      <div className="max-w-md mx-auto pt-4 text-center">
        <p className="text-xs text-[#57423f] mb-2 font-medium">Planning somewhere else?</p>
        <div className="flex gap-2">
          <input
            id="wizard-custom-city-input"
            type="text"
            placeholder="Type any city (e.g., Reykjavik, Cape Town, Oaxaca)"
            value={customCity}
            onChange={e => setCustomCity(e.target.value)}
            className="flex-1 px-4 py-2 rounded-xl border border-[#dec0bc] text-xs text-[#181c1d] outline-none"
          />
          <button
            id="wizard-custom-city-apply-btn"
            type="button"
            onClick={handleApplyCustom}
            className="px-4 py-2 rounded-xl bg-[#57423f] hover:bg-[#181c1d] text-white text-xs font-semibold"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

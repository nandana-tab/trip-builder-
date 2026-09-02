import React, { useState } from 'react';
import { useTrip } from '../../context/TripContext';
import { BudgetTier } from '../../types';
import {
  CURRENCIES,
  getCurrencyConfig,
  convertUSDToCurrency,
  convertCurrencyToUSD,
  formatRawAmount
} from '../../utils/currency';
import {
  getDestinationCostProfile,
  getFormattedTierDailyRange,
  getDestinationDailyAvgUSD,
  getDestinationSliderRange
} from '../../utils/destinationCost';

export const Step4Budget: React.FC = () => {
  const { wizardDraft, updateWizardDraft } = useTrip();
  const [isEditingExact, setIsEditingExact] = useState(false);

  const activeCurrency = wizardDraft.currency || 'USD';
  const currConfig = getCurrencyConfig(activeCurrency);

  // Get destination-specific cost profile
  const destProfile = getDestinationCostProfile(
    wizardDraft.destination,
    wizardDraft.destination_country
  );

  const currentConvertedTotal = convertUSDToCurrency(
    wizardDraft.total_budget_usd,
    activeCurrency
  );

  // Dynamic slider range calculation based on destination + duration + group size
  const sliderRange = getDestinationSliderRange(
    wizardDraft.destination,
    wizardDraft.destination_country,
    activeCurrency,
    wizardDraft.duration_days,
    wizardDraft.travel_group.size
  );

  const TIERS: {
    tier: BudgetTier;
    label: string;
    icon: string;
  }[] = [
    {
      tier: 'budget',
      label: 'Backpacker & Savvy Budget',
      icon: 'savings'
    },
    {
      tier: 'mid-range',
      label: 'Balanced Comfort',
      icon: 'hotel'
    },
    {
      tier: 'premium',
      label: 'Elevated & Curated',
      icon: 'star'
    },
    {
      tier: 'luxury',
      label: 'Bespoke Luxury',
      icon: 'diamond'
    }
  ];

  const handleSelectCurrency = (code: string) => {
    updateWizardDraft({
      currency: code
    });
  };

  const handleSelectTier = (tier: BudgetTier) => {
    const dailyAvg = getDestinationDailyAvgUSD(
      wizardDraft.destination,
      wizardDraft.destination_country,
      tier
    );
    const totalUSD = dailyAvg * wizardDraft.duration_days * wizardDraft.travel_group.size;
    updateWizardDraft({
      budget_tier: tier,
      total_budget_usd: Math.max(20, totalUSD)
    });
  };

  const handleSliderChange = (convertedVal: number) => {
    const usdVal = convertCurrencyToUSD(convertedVal, activeCurrency);
    updateWizardDraft({
      total_budget_usd: Math.max(20, usdVal)
    });
  };

  const handleExactInputChange = (valStr: string) => {
    const numeric = parseInt(valStr.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numeric)) {
      const usdVal = convertCurrencyToUSD(numeric, activeCurrency);
      updateWizardDraft({
        total_budget_usd: Math.max(10, usdVal)
      });
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-6 pt-1 sm:pt-2">
      <div className="text-center mb-6">
        <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d] inline-block mb-1">
          Step 4 of 7
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d] leading-tight">
          What's your target budget?
        </h2>
        <p className="text-sm text-[#57423f] mt-2">
          Calibrated automatically for living and travel costs in{' '}
          <strong className="text-[#a4362d]">
            {wizardDraft.destination || 'your destination'}
          </strong>.
        </p>
      </div>

      {/* Destination Purchasing Power & Cost Index Banner */}
      <div className="bg-[#ffdad5]/40 border border-[#dec0bc] rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-[#a4362d] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-xl">location_city</span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#181c1d]">
                Destination Cost Calibration: {destProfile.matchedName}
              </h3>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                destProfile.costLevel === 'ultra-low'
                  ? 'bg-emerald-100 text-emerald-800'
                  : destProfile.costLevel === 'low'
                  ? 'bg-teal-100 text-teal-800'
                  : destProfile.costLevel === 'moderate'
                  ? 'bg-blue-100 text-blue-800'
                  : destProfile.costLevel === 'high'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {destProfile.costLevel.replace('-', ' ')} cost
              </span>
            </div>
            <p className="text-xs text-[#57423f] mt-0.5">
              {destProfile.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Currency Selector Bar */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-[#dec0bc]/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[#a4362d] text-xl">payments</span>
            <h3 className="font-serif text-base font-bold text-[#181c1d]">
              Choose Planning Currency
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-[#8b716e]">
            Active: <strong className="text-[#a4362d]">{currConfig.flag} {currConfig.code} ({currConfig.symbol.trim()})</strong>
          </span>
        </div>

        {/* Currency Quick-Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
          {CURRENCIES.map(curr => {
            const isSelected = activeCurrency === curr.code;
            return (
              <button
                key={curr.code}
                id={`currency-btn-${curr.code.toLowerCase()}`}
                type="button"
                onClick={() => handleSelectCurrency(curr.code)}
                className={`py-2.5 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#a4362d] bg-[#a4362d] text-white shadow-xs'
                    : 'border-[#dec0bc]/60 bg-[#f7fafb] text-[#57423f] hover:bg-white hover:border-[#dec0bc]'
                }`}
              >
                <span>{curr.flag}</span>
                <span>{curr.code}</span>
                <span className="opacity-80">({curr.symbol.trim()})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Budget Tiers Grid (Dynamically Calculated per Destination & Currency) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TIERS.map(t => {
          const isSelected = wizardDraft.budget_tier === t.tier;
          const rangeDisplay = `${getFormattedTierDailyRange(
            wizardDraft.destination,
            wizardDraft.destination_country,
            t.tier,
            activeCurrency
          )} / day`;
          const tierDesc = destProfile.dailyRangesUSD[t.tier].label;

          return (
            <div
              key={t.tier}
              id={`budget-tier-${t.tier}`}
              onClick={() => handleSelectTier(t.tier)}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between select-none ${
                isSelected
                  ? 'border-[#a4362d] bg-[#ffdad5]/30 shadow-md ring-2 ring-[#a4362d]/20 scale-[1.01]'
                  : 'border-[#dec0bc]/70 bg-white hover:border-[#dec0bc] shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-2xl shadow-xs border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#a4362d] text-white border-[#a4362d]'
                        : 'bg-white text-[#a4362d] border-[#dec0bc]/40'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">{t.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-[#a4362d] bg-[#ffdad5]/80 px-2.5 py-1 rounded-full whitespace-nowrap">
                    {rangeDisplay}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#181c1d]">{t.label}</h3>
                <p className="text-xs text-[#57423f] mt-1.5 leading-relaxed">{tierDesc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Target Budget Calculator Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dec0bc]/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="font-serif text-xl font-bold text-[#181c1d]">Total Journey Budget</h4>
            <p className="text-xs text-[#57423f]">
              Calibrated for {wizardDraft.duration_days} day{wizardDraft.duration_days > 1 ? 's' : ''} in {wizardDraft.destination} × {wizardDraft.travel_group.size} traveler{wizardDraft.travel_group.size > 1 ? 's' : ''} ({wizardDraft.travel_group.type})
            </p>
          </div>

          <div className="text-right flex flex-col items-start sm:items-end">
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-serif font-bold text-[#a4362d]">
                {formatRawAmount(currentConvertedTotal, activeCurrency)}
              </span>
              <span className="text-xs font-bold text-[#8b716e] uppercase tracking-wider bg-[#ffdad5]/40 px-2 py-1 rounded-md">
                {currConfig.code}
              </span>
            </div>
            {activeCurrency !== 'USD' && (
              <span className="text-[11px] text-[#8b716e] mt-0.5">
                ≈ ${wizardDraft.total_budget_usd.toLocaleString()} USD
              </span>
            )}
          </div>
        </div>

        {/* Interactive Destination-Calibrated Slider */}
        <div className="pt-2 space-y-2">
          <input
            id="wizard-budget-slider"
            type="range"
            min={sliderRange.min}
            max={sliderRange.max}
            step={sliderRange.step}
            value={Math.min(sliderRange.max, Math.max(sliderRange.min, currentConvertedTotal))}
            onChange={e => handleSliderChange(Number(e.target.value))}
            className="w-full h-2.5 bg-[#dec0bc]/50 rounded-lg appearance-none cursor-pointer accent-[#a4362d]"
          />
          <div className="flex justify-between text-[11px] text-[#8b716e] font-semibold">
            <span>{formatRawAmount(sliderRange.min, activeCurrency)}</span>
            <span>{formatRawAmount(Math.round(sliderRange.min + (sliderRange.max - sliderRange.min) * 0.25), activeCurrency)}</span>
            <span>{formatRawAmount(Math.round(sliderRange.min + (sliderRange.max - sliderRange.min) * 0.5), activeCurrency)}</span>
            <span>{formatRawAmount(sliderRange.max, activeCurrency)}+</span>
          </div>
        </div>

        {/* Custom Exact Budget Input Toggle */}
        <div className="pt-2 border-t border-[#dec0bc]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <button
            id="toggle-exact-budget-btn"
            type="button"
            onClick={() => setIsEditingExact(!isEditingExact)}
            className="text-xs font-semibold text-[#a4362d] hover:text-[#8b2d25] flex items-center space-x-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">
              {isEditingExact ? 'expand_less' : 'edit'}
            </span>
            <span>{isEditingExact ? 'Hide custom amount box' : 'Type exact custom amount'}</span>
          </button>

          {isEditingExact && (
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="font-semibold text-[#57423f]">{currConfig.symbol}</span>
              <input
                id="exact-budget-input"
                type="number"
                value={currentConvertedTotal}
                onChange={e => handleExactInputChange(e.target.value)}
                className="w-36 px-3 py-1.5 rounded-xl border border-[#dec0bc] text-sm font-bold text-[#181c1d] bg-[#f7fafb] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#a4362d]"
                placeholder="Amount"
              />
              <span className="text-[11px] font-bold text-[#8b716e]">{currConfig.code}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


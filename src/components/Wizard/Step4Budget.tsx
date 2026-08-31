import React from 'react';
import { useTrip } from '../../context/TripContext';
import { BudgetTier } from '../../types';

export const Step4Budget: React.FC = () => {
  const { wizardDraft, updateWizardDraft } = useTrip();

  const TIERS: {
    tier: BudgetTier;
    label: string;
    range: string;
    dailyAvg: number;
    desc: string;
    icon: string;
  }[] = [
    {
      tier: 'budget',
      label: 'Savvy & Authentic',
      range: '$75 – $150 / day',
      dailyAvg: 110,
      desc: 'Boutique hostels, vibrant street markets, public transit & scenic self-guided tours',
      icon: 'savings'
    },
    {
      tier: 'mid-range',
      label: 'Balanced Comfort',
      range: '$150 – $350 / day',
      dailyAvg: 240,
      desc: 'Character hotels, trattoria & izakaya feasts, museum passes & small-group excursions',
      icon: 'hotel'
    },
    {
      tier: 'premium',
      label: 'Elevated & Curated',
      range: '$350 – $800 / day',
      dailyAvg: 520,
      desc: '4 & 5-star design stays, Michelin tastings, private guides & comfortable transport',
      icon: 'star'
    },
    {
      tier: 'luxury',
      label: 'Bespoke Luxury',
      range: '$800+ / day',
      dailyAvg: 1100,
      desc: 'Aman & luxury ryokans, private yachts, chef tables & dedicated concierge services',
      icon: 'diamond'
    }
  ];

  const handleSelectTier = (t: (typeof TIERS)[0]) => {
    const total = t.dailyAvg * wizardDraft.duration_days * wizardDraft.travel_group.size;
    updateWizardDraft({
      budget_tier: t.tier,
      total_budget_usd: total
    });
  };

  const handleTotalChange = (val: number) => {
    updateWizardDraft({
      total_budget_usd: Math.max(500, val)
    });
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d]">
          Step 4 of 6
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d] mt-1">
          What's your target budget?
        </h2>
        <p className="text-sm text-[#57423f] mt-2">
          We balance accommodations, dining, and activities against your financial goals.
        </p>
      </div>

      {/* Budget Tiers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TIERS.map(t => {
          const isSelected = wizardDraft.budget_tier === t.tier;
          return (
            <div
              key={t.tier}
              id={`budget-tier-${t.tier}`}
              onClick={() => handleSelectTier(t)}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#a4362d] bg-[#ffdad5]/30 shadow-md ring-2 ring-[#a4362d]/20 scale-[1.01]'
                  : 'border-[#dec0bc]/70 bg-white hover:border-[#dec0bc] shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-white text-[#a4362d] shadow-sm border border-[#dec0bc]/40 flex items-center justify-center">
                    <span className="material-symbols-outlined text-xl">{t.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-[#a4362d] bg-[#ffdad5]/60 px-2.5 py-1 rounded-full">
                    {t.range}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#181c1d]">{t.label}</h3>
                <p className="text-xs text-[#57423f] mt-1 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Target Budget Calculator Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dec0bc]/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-serif text-xl font-bold text-[#181c1d]">Total Journey Budget</h4>
            <p className="text-xs text-[#57423f]">
              Estimated for {wizardDraft.duration_days} days × {wizardDraft.travel_group.size} traveler{wizardDraft.travel_group.size > 1 ? 's' : ''}
            </p>
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-[#a4362d]">
            ${wizardDraft.total_budget_usd.toLocaleString()} <span className="text-xs font-sans text-[#8b716e]">USD</span>
          </div>
        </div>

        {/* Interactive Slider */}
        <div className="pt-2">
          <input
            id="wizard-budget-slider"
            type="range"
            min={500}
            max={25000}
            step={250}
            value={wizardDraft.total_budget_usd}
            onChange={e => handleTotalChange(Number(e.target.value))}
            className="w-full h-2 bg-[#dec0bc]/60 rounded-lg appearance-none cursor-pointer accent-[#a4362d]"
          />
          <div className="flex justify-between text-[11px] text-[#8b716e] mt-1 font-semibold">
            <span>$500</span>
            <span>$5,000</span>
            <span>$12,000</span>
            <span>$25,000+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { useTrip } from '../../context/TripContext';
import { TravelGroupType } from '../../types';
import { getDestinationDailyAvgUSD } from '../../utils/destinationCost';

export const Step3Group: React.FC = () => {
  const { wizardDraft, updateWizardDraft } = useTrip();

  const GROUPS: { type: TravelGroupType; title: string; desc: string; icon: string; defaultSize: number }[] = [
    { type: 'Solo', title: 'Solo Explorer', desc: 'Freedom to wander, spontaneous detours & quiet reflection', icon: 'person', defaultSize: 1 },
    { type: 'Couple', title: 'Couple / Duo', desc: 'Romantic dinners, shared adventures & intimate stays', icon: 'favorite', defaultSize: 2 },
    { type: 'Family', title: 'Family Vacation', desc: 'Multi-generational activities, kid-friendly spots & spacious stays', icon: 'family_restroom', defaultSize: 4 },
    { type: 'Friends', title: 'Friends Getaway', desc: 'Group dining, vibrant nightlife & dynamic collective experiences', icon: 'group', defaultSize: 3 }
  ];

  const currentType = wizardDraft.travel_group.type;
  const isSolo = currentType === 'Solo';
  const isCouple = currentType === 'Couple';
  const isFixed = isSolo || isCouple;

  const handleSelectGroup = (type: TravelGroupType, defaultSize: number) => {
    let size = defaultSize;
    if (type === 'Solo') {
      size = 1;
    } else if (type === 'Couple') {
      size = 2;
    } else if (type === 'Family') {
      size = wizardDraft.travel_group.size >= 2 ? wizardDraft.travel_group.size : 4;
    } else if (type === 'Friends') {
      size = wizardDraft.travel_group.size >= 2 ? wizardDraft.travel_group.size : 3;
    }

    const dailyAvg = getDestinationDailyAvgUSD(
      wizardDraft.destination,
      wizardDraft.destination_country,
      wizardDraft.budget_tier || 'mid-range'
    );
    const newBudget = dailyAvg * wizardDraft.duration_days * size;

    updateWizardDraft({
      travel_group: {
        type,
        size,
        label: `${size} Traveler${size > 1 ? 's' : ''}`
      },
      total_budget_usd: Math.max(20, newBudget)
    });
  };

  const handleSizeChange = (newSize: number) => {
    if (isSolo || isCouple) return;
    if (newSize < 2 || newSize > 20) return;

    const dailyAvg = getDestinationDailyAvgUSD(
      wizardDraft.destination,
      wizardDraft.destination_country,
      wizardDraft.budget_tier || 'mid-range'
    );
    const newBudget = dailyAvg * wizardDraft.duration_days * newSize;

    updateWizardDraft({
      travel_group: {
        ...wizardDraft.travel_group,
        size: newSize,
        label: `${newSize} Traveler${newSize > 1 ? 's' : ''}`
      },
      total_budget_usd: Math.max(20, newBudget)
    });
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pt-1 sm:pt-2">
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d] inline-block mb-1">
          Step 3 of 7
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d] leading-tight">
          Who's coming along?
        </h2>
        <p className="text-sm text-[#57423f] mt-2">
          Tailors recommendations for party size, dining reservations, and room configurations.
        </p>
      </div>

      {/* Group Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GROUPS.map(g => {
          const isSelected = wizardDraft.travel_group.type === g.type;
          return (
            <div
              key={g.type}
              id={`group-type-${g.type.toLowerCase()}`}
              onClick={() => handleSelectGroup(g.type, g.defaultSize)}
              className={`p-6 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'border-[#a4362d] bg-[#ffdad5]/30 shadow-md ring-2 ring-[#a4362d]/20 scale-[1.01]'
                  : 'border-[#dec0bc]/70 bg-white hover:border-[#dec0bc] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white text-[#a4362d] shadow-sm border border-[#dec0bc]/40 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-2xl">{g.icon}</span>
                </div>
                {isSelected && (
                  <span className="w-6 h-6 rounded-full bg-[#a4362d] text-white flex items-center justify-center shadow">
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  </span>
                )}
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-bold text-[#181c1d]">{g.title}</h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#f6dedc] text-[#57423f]">
                    {g.type === 'Solo' ? '1 Person' : g.type === 'Couple' ? '2 People' : '2+ People'}
                  </span>
                </div>
                <p className="text-xs text-[#57423f] mt-1 leading-relaxed">{g.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Number of Travelers Stepper */}
      <div className="bg-white rounded-3xl p-6 border border-[#dec0bc]/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-serif text-lg font-bold text-[#181c1d]">Number of Travelers</h4>
          <p className="text-xs text-[#57423f]">
            {isSolo
              ? 'Fixed at 1 traveler for solo adventures'
              : isCouple
              ? 'Fixed at 2 travelers for couple getaways'
              : 'Adjust exact guest count for dining & tickets (2 – 20)'}
          </p>
        </div>

        <div className="flex items-center space-x-3 self-end sm:self-center">
          <button
            id="decrement-travelers-btn"
            type="button"
            onClick={() => handleSizeChange(wizardDraft.travel_group.size - 1)}
            disabled={isFixed || wizardDraft.travel_group.size <= 2}
            className="w-10 h-10 rounded-full border border-[#dec0bc] flex items-center justify-center text-[#181c1d] hover:bg-[#ffdad5]/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title={isFixed ? `${currentType} is fixed at ${wizardDraft.travel_group.size}` : 'Decrease travelers'}
          >
            <span className="material-symbols-outlined text-xl">remove</span>
          </button>

          <div className="flex flex-col items-center min-w-[3rem]">
            <span className="text-center font-bold text-lg text-[#181c1d]">
              {wizardDraft.travel_group.size}
            </span>
            {isFixed && (
              <span className="text-[10px] text-[#8b716e] uppercase tracking-wider font-medium">
                Fixed
              </span>
            )}
          </div>

          <button
            id="increment-travelers-btn"
            type="button"
            onClick={() => handleSizeChange(wizardDraft.travel_group.size + 1)}
            disabled={isFixed || wizardDraft.travel_group.size >= 20}
            className="w-10 h-10 rounded-full border border-[#dec0bc] flex items-center justify-center text-[#181c1d] hover:bg-[#ffdad5]/40 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title={isFixed ? `${currentType} is fixed at ${wizardDraft.travel_group.size}` : 'Increase travelers'}
          >
            <span className="material-symbols-outlined text-xl">add</span>
          </button>
        </div>
      </div>
    </div>
  );
};

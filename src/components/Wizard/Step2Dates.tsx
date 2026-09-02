import React from 'react';
import { useTrip } from '../../context/TripContext';
import { getDestinationDailyAvgUSD } from '../../utils/destinationCost';

export const Step2Dates: React.FC = () => {
  const { wizardDraft, updateWizardDraft } = useTrip();

  const handleStartDateChange = (val: string) => {
    const start = new Date(val);
    const end = new Date(start);
    end.setDate(start.getDate() + (wizardDraft.duration_days - 1));

    updateWizardDraft({
      start_date: val,
      end_date: end.toISOString().split('T')[0]
    });
  };

  const handleEndDateChange = (val: string) => {
    const start = new Date(wizardDraft.start_date);
    const end = new Date(val);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);

    const dailyAvg = getDestinationDailyAvgUSD(
      wizardDraft.destination,
      wizardDraft.destination_country,
      wizardDraft.budget_tier || 'mid-range'
    );
    const newBudget = dailyAvg * diffDays * wizardDraft.travel_group.size;

    updateWizardDraft({
      end_date: val,
      duration_days: diffDays,
      total_budget_usd: Math.max(20, newBudget)
    });
  };

  const handleCustomDaysChange = (days: number) => {
    const validDays = Math.max(1, Math.min(60, isNaN(days) ? 1 : days));
    const start = new Date(wizardDraft.start_date || new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + (validDays - 1));

    const dailyAvg = getDestinationDailyAvgUSD(
      wizardDraft.destination,
      wizardDraft.destination_country,
      wizardDraft.budget_tier || 'mid-range'
    );
    const newBudget = dailyAvg * validDays * wizardDraft.travel_group.size;

    updateWizardDraft({
      duration_days: validDays,
      end_date: end.toISOString().split('T')[0],
      total_budget_usd: Math.max(20, newBudget)
    });
  };

  const handlePresetDays = (days: number) => {
    handleCustomDaysChange(days);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-2xl mx-auto w-full overflow-hidden pt-1 sm:pt-2">
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d] inline-block mb-1">
          Step 2 of 7
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#181c1d] leading-tight">
          When are you going?
        </h2>
        <p className="text-xs sm:text-sm text-[#57423f] mt-2">
          Pick your travel window, select a standard preset, or enter your exact custom journey days.
        </p>
      </div>

      {/* Duration Quick Presets & Custom Days */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#57423f] uppercase tracking-wider">
            Duration Presets & Length
          </label>
          <span className="text-xs font-bold text-[#a4362d]">
            {wizardDraft.duration_days} Day{wizardDraft.duration_days > 1 ? 's' : ''} Selected
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {[
            { label: 'Long Weekend', days: 3, icon: 'weekend' },
            { label: '5 Days', days: 5, icon: 'wb_sunny' },
            { label: '1 Week', days: 7, icon: 'calendar_view_week' },
            { label: '10 Days', days: 10, icon: 'date_range' },
            { label: '2 Weeks', days: 14, icon: 'calendar_month' },
            { label: '3 Weeks', days: 21, icon: 'hiking' }
          ].map(preset => {
            const isSelected = wizardDraft.duration_days === preset.days;
            return (
              <button
                key={preset.days}
                id={`duration-preset-${preset.days}d`}
                type="button"
                onClick={() => handlePresetDays(preset.days)}
                className={`p-3 sm:p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer select-none ${
                  isSelected
                    ? 'border-[#a4362d] bg-[#ffdad5]/40 text-[#a4362d] shadow-sm ring-2 ring-[#a4362d]/20'
                    : 'border-[#dec0bc]/60 bg-white hover:border-[#dec0bc] text-[#181c1d]'
                }`}
              >
                <span className="material-symbols-outlined text-xl sm:text-2xl">{preset.icon}</span>
                <span className="text-xs sm:text-sm font-bold">{preset.label}</span>
                <span className="text-[10px] sm:text-[11px] text-[#57423f]">{preset.days} Days</span>
              </button>
            );
          })}
        </div>

        {/* Custom Duration Stepper / Number Input Card */}
        <div
          id="custom-duration-card"
          className="bg-white rounded-2xl p-4 border border-[#dec0bc]/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ffdad5]/50 flex items-center justify-center text-[#a4362d]">
              <span className="material-symbols-outlined text-lg">tune</span>
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-[#181c1d]">Custom Duration</h4>
              <p className="text-[11px] text-[#57423f]">Enter any exact number of days (1–60)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              id="decrease-custom-days-btn"
              type="button"
              onClick={() => handleCustomDaysChange(wizardDraft.duration_days - 1)}
              disabled={wizardDraft.duration_days <= 1}
              className="w-9 h-9 rounded-xl border border-[#dec0bc] bg-[#f7fafb] hover:bg-[#ffdad5]/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold text-[#181c1d] cursor-pointer transition-colors"
              title="Decrease day"
            >
              -
            </button>

            <div className="relative">
              <input
                id="custom-days-number-input"
                type="number"
                min={1}
                max={60}
                value={wizardDraft.duration_days}
                onChange={e => handleCustomDaysChange(parseInt(e.target.value, 10))}
                className="w-20 px-2 py-1.5 rounded-xl border-2 border-[#a4362d] text-center font-bold text-sm text-[#181c1d] bg-white outline-none focus:ring-2 focus:ring-[#ffdad5]"
              />
              <span className="text-[10px] text-[#8b716e] font-semibold block text-center mt-0.5">
                days
              </span>
            </div>

            <button
              id="increase-custom-days-btn"
              type="button"
              onClick={() => handleCustomDaysChange(wizardDraft.duration_days + 1)}
              disabled={wizardDraft.duration_days >= 60}
              className="w-9 h-9 rounded-xl border border-[#dec0bc] bg-[#f7fafb] hover:bg-[#ffdad5]/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-sm font-bold text-[#181c1d] cursor-pointer transition-colors"
              title="Increase day"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Date Pickers */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#dec0bc]/80 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#57423f] mb-2 flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-base text-[#a4362d]">flight_takeoff</span>
              <span>Start Date</span>
            </label>
            <input
              id="wizard-start-date-input"
              type="date"
              value={wizardDraft.start_date}
              onChange={e => handleStartDateChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#dec0bc] focus:border-[#a4362d] focus:ring-2 focus:ring-[#ffdad5] text-sm text-[#181c1d] outline-none bg-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#57423f] mb-2 flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-base text-[#a4362d]">flight_land</span>
              <span>End Date</span>
            </label>
            <input
              id="wizard-end-date-input"
              type="date"
              value={wizardDraft.end_date}
              min={wizardDraft.start_date}
              onChange={e => handleEndDateChange(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#dec0bc] focus:border-[#a4362d] focus:ring-2 focus:ring-[#ffdad5] text-sm text-[#181c1d] outline-none bg-white"
            />
          </div>
        </div>

        {/* Calculated Days Display Badge */}
        <div className="p-4 rounded-2xl bg-[#f7fafb] border border-[#dec0bc]/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad5] text-[#a4362d] flex items-center justify-center font-bold text-sm sm:text-base">
              {wizardDraft.duration_days}
            </div>
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-[#8b716e] uppercase">Total Duration</p>
              <p className="text-xs sm:text-sm font-bold text-[#181c1d]">
                {wizardDraft.duration_days} Day{wizardDraft.duration_days > 1 ? 's' : ''} / {Math.max(1, wizardDraft.duration_days - 1)} Nights
              </p>
            </div>
          </div>
          <div className="text-[11px] sm:text-xs text-[#57423f] text-right font-medium">
            <span>
              {wizardDraft.duration_days <= 4
                ? 'Quick getaway pacing'
                : wizardDraft.duration_days <= 10
                ? 'Optimal balanced pacing'
                : 'Immersive grand tour pacing'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

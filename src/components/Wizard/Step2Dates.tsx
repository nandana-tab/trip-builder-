import React from 'react';
import { useTrip } from '../../context/TripContext';

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

    updateWizardDraft({
      end_date: val,
      duration_days: diffDays
    });
  };

  const handlePresetDays = (days: number) => {
    const start = new Date(wizardDraft.start_date || new Date());
    const end = new Date(start);
    end.setDate(start.getDate() + (days - 1));

    updateWizardDraft({
      duration_days: days,
      end_date: end.toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d]">
          Step 2 of 6
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d] mt-1">
          When are you going?
        </h2>
        <p className="text-sm text-[#57423f] mt-2">
          Pick your travel window or choose a standard journey length.
        </p>
      </div>

      {/* Duration Quick Presets */}
      <div>
        <label className="block text-xs font-semibold text-[#57423f] uppercase tracking-wider mb-3 text-center">
          Quick Duration Presets
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Long Weekend', days: 3, icon: 'weekend' },
            { label: '1 Week', days: 7, icon: 'calendar_view_week' },
            { label: '10 Days', days: 10, icon: 'date_range' },
            { label: '2 Weeks', days: 14, icon: 'calendar_month' }
          ].map(preset => {
            const isSelected = wizardDraft.duration_days === preset.days;
            return (
              <button
                key={preset.days}
                id={`duration-preset-${preset.days}d`}
                type="button"
                onClick={() => handlePresetDays(preset.days)}
                className={`p-4 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                  isSelected
                    ? 'border-[#a4362d] bg-[#ffdad5]/40 text-[#a4362d] shadow-sm'
                    : 'border-[#dec0bc]/60 bg-white hover:border-[#dec0bc] text-[#181c1d]'
                }`}
              >
                <span className="material-symbols-outlined text-2xl">{preset.icon}</span>
                <span className="text-sm font-bold">{preset.label}</span>
                <span className="text-[11px] text-[#57423f]">{preset.days} Days</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date Pickers */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dec0bc]/80 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
              className="w-full px-4 py-3 rounded-xl border border-[#dec0bc] focus:border-[#a4362d] focus:ring-2 focus:ring-[#ffdad5] text-sm text-[#181c1d] outline-none"
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
              className="w-full px-4 py-3 rounded-xl border border-[#dec0bc] focus:border-[#a4362d] focus:ring-2 focus:ring-[#ffdad5] text-sm text-[#181c1d] outline-none"
            />
          </div>
        </div>

        {/* Calculated Days Display Badge */}
        <div className="p-4 rounded-2xl bg-[#f7fafb] border border-[#dec0bc]/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad5] text-[#a4362d] flex items-center justify-center font-bold">
              {wizardDraft.duration_days}
            </div>
            <div>
              <p className="text-xs font-semibold text-[#8b716e] uppercase">Total Duration</p>
              <p className="text-sm font-bold text-[#181c1d]">
                {wizardDraft.duration_days} Days / {Math.max(1, wizardDraft.duration_days - 1)} Nights
              </p>
            </div>
          </div>
          <div className="text-xs text-[#57423f] text-right font-medium">
            <span>Optimal for {wizardDraft.duration_days >= 7 ? 'in-depth' : 'highlights'} pacing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

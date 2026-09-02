import React from 'react';
import { useTrip } from '../../context/TripContext';
import { TRAVEL_DNA_OPTIONS } from '../../data/seedData';

export const Step5DNA: React.FC = () => {
  const { wizardDraft, updateWizardDraft } = useTrip();

  const handleToggleDNA = (id: string, label: string) => {
    const isSelected = wizardDraft.travel_dna.includes(id);
    let newDNA = [...wizardDraft.travel_dna];
    let newPriorityTags = [...wizardDraft.priority_tags];

    if (isSelected) {
      newDNA = newDNA.filter(d => d !== id);
      newPriorityTags = newPriorityTags.filter(t => t !== label);
    } else {
      newDNA.push(id);
      if (newPriorityTags.length < 3) {
        newPriorityTags.push(label);
      }
    }

    updateWizardDraft({
      travel_dna: newDNA,
      priority_tags: newPriorityTags
    });
  };

  const handleTogglePriority = (e: React.MouseEvent, label: string, dnaId: string) => {
    e.stopPropagation();

    // Ensure it's in travel_dna
    let newDNA = [...wizardDraft.travel_dna];
    if (!newDNA.includes(dnaId)) {
      newDNA.push(dnaId);
    }

    let newPriorities = [...wizardDraft.priority_tags];
    if (newPriorities.includes(label)) {
      newPriorities = newPriorities.filter(p => p !== label);
    } else {
      if (newPriorities.length >= 3) {
        // Replace oldest or cap at 3
        newPriorities.shift();
      }
      newPriorities.push(label);
    }

    updateWizardDraft({
      travel_dna: newDNA,
      priority_tags: newPriorities
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full overflow-hidden pt-1 sm:pt-2">
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d] inline-block mb-1">
          Step 5 of 7
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#181c1d] leading-tight">
          What is your Travel DNA?
        </h2>
        <p className="text-xs sm:text-sm text-[#57423f] mt-2">
          Select what excites you most. Star up to <strong className="text-[#a4362d]">3 as Top Priority</strong> to heavily influence your curation.
        </p>
      </div>

      {/* Selected Priority Summary Indicator with wrap-enabled badges */}
      <div
        id="top-priorities-summary-box"
        className="w-full max-w-full p-3.5 sm:p-4 rounded-2xl bg-[#ffdad5]/40 border border-[#dec0bc] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs overflow-hidden"
      >
        <div className="flex items-center space-x-2 shrink-0">
          <span className="material-symbols-outlined text-[#a4362d] text-lg">hotel_class</span>
          <span className="font-bold text-[#181c1d]">
            Top Priorities ({wizardDraft.priority_tags.length}/3):
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto items-center">
          {wizardDraft.priority_tags.length > 0 ? (
            wizardDraft.priority_tags.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#a4362d] text-white text-[11px] font-bold shadow-xs max-w-full"
              >
                <span className="truncate max-w-[180px] sm:max-w-none">{tag}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newTags = wizardDraft.priority_tags.filter(t => t !== tag);
                    updateWizardDraft({ priority_tags: newTags });
                  }}
                  className="hover:bg-white/20 rounded-full w-4 h-4 flex items-center justify-center cursor-pointer text-xs shrink-0"
                  title="Remove priority"
                >
                  ×
                </button>
              </span>
            ))
          ) : (
            <span className="text-[#57423f] italic text-xs">
              Click the star icon ⭐ on any card to designate top priority
            </span>
          )}
        </div>
      </div>

      {/* DNA Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-full">
        {TRAVEL_DNA_OPTIONS.map(opt => {
          const isSelected = wizardDraft.travel_dna.includes(opt.id);
          const isPriority = wizardDraft.priority_tags.includes(opt.label);

          return (
            <div
              key={opt.id}
              id={`dna-card-${opt.id}`}
              onClick={() => handleToggleDNA(opt.id, opt.label)}
              className={`p-3.5 sm:p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex items-start justify-between relative select-none w-full min-w-0 max-w-full overflow-hidden ${
                isPriority
                  ? 'border-[#a4362d] bg-[#ffdad5]/50 shadow-md ring-2 ring-[#a4362d]/20'
                  : isSelected
                  ? 'border-[#a4362d]/70 bg-[#ffdad5]/20 shadow-xs'
                  : 'border-[#dec0bc]/60 bg-white hover:border-[#dec0bc]'
              }`}
            >
              <div className="flex items-start space-x-3 pr-2 min-w-0 flex-1">
                <div
                  className={`w-9 h-9 sm:w-12 sm:h-12 rounded-2xl flex-shrink-0 flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#a4362d] text-white' : 'bg-[#f7fafb] text-[#57423f]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl sm:text-2xl">{opt.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-sm sm:text-lg font-bold text-[#181c1d] truncate sm:whitespace-normal">
                    {opt.label}
                  </h3>
                  <p className="text-xs text-[#57423f] mt-1 leading-relaxed line-clamp-2 sm:line-clamp-none">
                    {opt.description}
                  </p>
                </div>
              </div>

              {/* Star Priority Button */}
              <button
                id={`star-priority-${opt.id}`}
                type="button"
                title={isPriority ? 'Remove Top Priority' : 'Set as Top Priority (Max 3)'}
                onClick={e => handleTogglePriority(e, opt.label, opt.id)}
                className={`p-2 sm:p-2.5 min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] rounded-xl flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                  isPriority
                    ? 'bg-[#a4362d] text-white shadow-xs scale-105'
                    : 'text-[#8b716e] hover:bg-[#ffdad5]/60 hover:text-[#a4362d]'
                }`}
              >
                <span className="material-symbols-outlined text-lg sm:text-xl">
                  {isPriority ? 'star' : 'star_outline'}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

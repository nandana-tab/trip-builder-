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
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d]">
          Step 5 of 6
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d] mt-1">
          What is your Travel DNA?
        </h2>
        <p className="text-sm text-[#57423f] mt-2">
          Select what excites you most. Star up to <strong className="text-[#a4362d]">3 as Top Priority</strong> to heavily influence your curation.
        </p>
      </div>

      {/* Selected Priority Summary Indicator */}
      <div className="p-3.5 rounded-2xl bg-[#ffdad5]/40 border border-[#dec0bc] flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-[#a4362d] text-lg">hotel_class</span>
          <span className="font-semibold text-[#181c1d]">
            Top Priorities ({wizardDraft.priority_tags.length}/3 selected):
          </span>
          <span className="text-[#57423f] truncate">
            {wizardDraft.priority_tags.length > 0
              ? wizardDraft.priority_tags.join(' • ')
              : 'Click the star icon on any card to designate top priority'}
          </span>
        </div>
      </div>

      {/* DNA Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TRAVEL_DNA_OPTIONS.map(opt => {
          const isSelected = wizardDraft.travel_dna.includes(opt.id);
          const isPriority = wizardDraft.priority_tags.includes(opt.label);

          return (
            <div
              key={opt.id}
              id={`dna-card-${opt.id}`}
              onClick={() => handleToggleDNA(opt.id, opt.label)}
              className={`p-5 rounded-3xl border-2 cursor-pointer transition-all duration-200 flex items-start justify-between relative ${
                isPriority
                  ? 'border-[#a4362d] bg-[#ffdad5]/50 shadow-md ring-2 ring-[#a4362d]/20'
                  : isSelected
                  ? 'border-[#a4362d]/70 bg-[#ffdad5]/20 shadow-sm'
                  : 'border-[#dec0bc]/60 bg-white hover:border-[#dec0bc]'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-[#a4362d] text-white' : 'bg-[#f7fafb] text-[#57423f]'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">{opt.icon}</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-serif text-lg font-bold text-[#181c1d]">
                      {opt.label}
                    </h3>
                  </div>
                  <p className="text-xs text-[#57423f] mt-1 leading-relaxed">
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
                className={`p-2 rounded-xl transition-all ${
                  isPriority
                    ? 'bg-[#a4362d] text-white shadow-sm scale-110'
                    : 'text-[#8b716e] hover:bg-[#ffdad5]/60 hover:text-[#a4362d]'
                }`}
              >
                <span className="material-symbols-outlined text-xl">
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

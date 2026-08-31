import React from 'react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#181c1d] text-white border-t border-white/10 pt-16 pb-12 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#a4362d] flex items-center justify-center text-white font-bold">
                <span className="material-symbols-outlined text-lg">travel_explore</span>
              </div>
              <span className="font-serif text-xl font-bold tracking-tight">TripBuilder</span>
            </div>
            <p className="text-xs text-[#dec0bc] max-w-sm leading-relaxed">
              Precision travel curation powered by ground-truth local research and AI calibration. Personalize bespoke journeys, swap recommendations, and manage budgets in real time.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#ffdad5] mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-[#dec0bc]">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-white transition-colors">
                  Featured Destinations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  My Travel Portfolio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-white transition-colors">
                  Plan New Journey
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-[#ffdad5] mb-3">
              Destinations
            </h4>
            <ul className="space-y-2 text-xs text-[#dec0bc]">
              <li>Tokyo & Kyoto, Japan</li>
              <li>Amalfi Coast & Rome, Italy</li>
              <li>Lisbon & Sintra, Portugal</li>
              <li>Bali, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8b716e]">
          <p>© 2026 TripBuilder. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Designed with modern editorial typography and thoughtful craftsmanship.</p>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { POPULAR_DESTINATIONS } from '../data/seedData';
import { useTrip } from '../context/TripContext';

interface LandingPageProps {
  onStartWizard: (destination?: string, initialStep?: number) => void;
  onExploreTrip: (tripId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartWizard, onExploreTrip }) => {
  const { updateWizardDraft, quickPlanPreset } = useTrip();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDestinations = POPULAR_DESTINATIONS.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.highlightTags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectDestination = (dest: (typeof POPULAR_DESTINATIONS)[0]) => {
    updateWizardDraft({
      destination: dest.name,
      destination_country: dest.country,
      destination_image: dest.image,
      total_budget_usd: dest.avgDailyBudget * 7 * 2
    });
    // When a specific place is clicked from catalog/pills, advance directly to Step 2 (Dates)
    onStartWizard(dest.name, 2);
  };

  const handleQuickPreset = (destName: string, days: number) => {
    const newTripId = quickPlanPreset(destName, days);
    onExploreTrip(newTripId);
  };

  return (
    <div className="min-h-screen bg-[#f7fafb]">
      {/* Editorial Hero Section */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden">
        {/* Background Image with warm gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2000&q=85"
            alt="Amalfi Coast sunset panorama"
            className="w-full h-full object-cover object-center scale-105 transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181c1d] via-[#181c1d]/50 to-black/30"></div>
          <div className="absolute inset-0 bg-radial from-transparent via-[#a4362d]/10 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center text-white py-16">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 mb-6 text-xs sm:text-sm font-medium tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#ffdad5] animate-pulse"></span>
            <span>Traveler Community Curation</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6 text-balance shadow-sm">
            Plan the trip. <br />
            <span className="italic font-normal text-[#ffdad5]">Skip the agency.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[#dec0bc] max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
            Curated itineraries crafted from authentic recommendations by seasoned travelers. Swap activities, customize daily schedules, and manage budgets in real time.
          </p>

          {/* Quick Search & Plan Bar */}
          <div className="max-w-xl mx-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-white/30 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1 flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-[#8b716e]">
                search
              </span>
              <input
                id="hero-destination-search-input"
                type="text"
                placeholder="Where to? (e.g., Tokyo, Amalfi, Kyoto, Bali...)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    if (searchQuery.trim()) {
                      const match = POPULAR_DESTINATIONS.find(d => d.name.toLowerCase() === searchQuery.trim().toLowerCase());
                      if (match) {
                        handleSelectDestination(match);
                      } else {
                        updateWizardDraft({
                          destination: searchQuery.trim(),
                          destination_country: 'Global',
                          destination_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
                          total_budget_usd: 200 * 7 * 2
                        });
                        onStartWizard(searchQuery.trim(), 2);
                      }
                    } else {
                      onStartWizard(undefined, 1);
                    }
                  }
                }}
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-[#181c1d] placeholder:text-[#8b716e] outline-none bg-transparent"
              />
            </div>
            <button
              id="hero-start-planning-btn"
              onClick={() => {
                if (searchQuery.trim()) {
                  const match = POPULAR_DESTINATIONS.find(d => d.name.toLowerCase() === searchQuery.trim().toLowerCase());
                  if (match) {
                    handleSelectDestination(match);
                  } else {
                    updateWizardDraft({
                      destination: searchQuery.trim(),
                      destination_country: 'Global',
                      destination_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
                      total_budget_usd: 200 * 7 * 2
                    });
                    onStartWizard(searchQuery.trim(), 2);
                  }
                } else {
                  // Plan Trip without pre-selected destination opens Step 1
                  onStartWizard(undefined, 1);
                }
              }}
              className="px-6 py-3.5 rounded-xl bg-[#a4362d] hover:bg-[#8b2d25] text-white font-semibold text-sm shadow-md transition-all duration-200 flex items-center justify-center space-x-2 whitespace-nowrap"
            >
              <span>Plan My Trip</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>

          {/* Quick Destination Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6 text-xs text-white/80">
            <span className="font-medium text-[#dec0bc]">Popular:</span>
            {['India', 'United States', 'China', 'United Kingdom', 'Lisbon', 'Tokyo', 'Kyoto', 'Amalfi Coast', 'Bali', 'Paris'].map(dest => (
              <button
                key={dest}
                onClick={() => {
                  const match = POPULAR_DESTINATIONS.find(d => d.name.toLowerCase() === dest.toLowerCase());
                  if (match) {
                    handleSelectDestination(match);
                  } else {
                    updateWizardDraft({
                      destination: dest,
                      destination_country: 'Global',
                      destination_image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
                      total_budget_usd: 200 * 7 * 2
                    });
                    onStartWizard(dest, 2);
                  }
                }}
                className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors backdrop-blur-sm"
              >
                {dest}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* The TripBuilder Way Pillars */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a4362d] bg-[#ffdad5]/50 px-3 py-1 rounded-full">
            The TripBuilder Way
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d] mt-3">
            Effortless curation, bespoke execution.
          </h2>
          <p className="text-base text-[#57423f] mt-3">
            Every itinerary is built from ground-truth local research, adjusted to your travel style, and fully customizable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-3xl p-8 border border-[#dec0bc]/50 shadow-sm hover:shadow-md transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-[#ffdad5] text-[#a4362d] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#181c1d] mb-2">
              Bespoke Travel DNA
            </h3>
            <p className="text-sm text-[#57423f] leading-relaxed">
              We calibrate your recommendations based on culinary interests, pacing, fine-tuned stay tiers, and authentic hidden gems.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white rounded-3xl p-8 border border-[#dec0bc]/50 shadow-sm hover:shadow-md transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-[#ffdad5] text-[#a4362d] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">swap_horiz</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#181c1d] mb-2">
              One-Click Recommendation Swaps
            </h3>
            <p className="text-sm text-[#57423f] leading-relaxed">
              Not in the mood for a museum? Swap any activity, restaurant, or stay with curated alternatives in the exact same neighborhood.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white rounded-3xl p-8 border border-[#dec0bc]/50 shadow-sm hover:shadow-md transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-[#ffdad5] text-[#a4362d] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#181c1d] mb-2">
              Live Fiscal Blueprint
            </h3>
            <p className="text-sm text-[#57423f] leading-relaxed">
              Real-time budget tracking breaks down stays, dining, and tours against your target limit so there are never any surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Curated Journeys */}
      <section className="py-16 bg-[#ffdad5]/20 border-y border-[#dec0bc]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#a4362d]">
                Featured Itineraries
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d] mt-1">
                Popular Journeys
              </h2>
              <p className="text-sm text-[#57423f] mt-1">
                Hand-curated blueprints crafted by our travel specialists.
              </p>
            </div>
            <button
              id="view-all-destinations-btn"
              onClick={() => onStartWizard()}
              className="mt-4 sm:mt-0 inline-flex items-center space-x-1.5 text-sm font-semibold text-[#a4362d] hover:text-[#8b2d25]"
            >
              <span>Build Custom Journey</span>
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1: Kyoto Traditions */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#dec0bc]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative h-60 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80"
                  alt="Kyoto Torii & Temples"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#a4362d]">
                  7 Days • Japan
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs">
                  Zen Gardens, Kaiseki Omakase & Geisha Teahouses
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#181c1d] group-hover:text-[#a4362d] transition-colors">
                    Kyoto Traditions & Temples
                  </h3>
                  <p className="text-xs text-[#57423f] mt-2 line-clamp-2">
                    A deep dive into Kansai heritage featuring early morning Torii climbs, private tea tastings, and Arashiyama river ryokans.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#dec0bc]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-[#8b716e] font-semibold">Est. Budget</span>
                    <p className="text-sm font-bold text-[#181c1d]">$1,950 / person</p>
                  </div>
                  <button
                    id="explore-kyoto-preset-btn"
                    onClick={() => handleQuickPreset('Kyoto', 7)}
                    className="px-4 py-2 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Open Blueprint
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Amalfi Coastline */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#dec0bc]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative h-60 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80"
                  alt="Amalfi Coast Cliffside"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#a4362d]">
                  5 Days • Italy
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs">
                  Path of Gods, Capri Private Cruise & Candlelit Dining
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#181c1d] group-hover:text-[#a4362d] transition-colors">
                    Amalfi Coastline & Capri
                  </h3>
                  <p className="text-xs text-[#57423f] mt-2 line-clamp-2">
                    Cliffside lemon groves, private wooden boat tours to hidden grottos, and dinner overlooking Positano bay.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#dec0bc]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-[#8b716e] font-semibold">Est. Budget</span>
                    <p className="text-sm font-bold text-[#181c1d]">$2,400 / person</p>
                  </div>
                  <button
                    id="explore-amalfi-preset-btn"
                    onClick={() => handleQuickPreset('Amalfi Coast', 5)}
                    className="px-4 py-2 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Open Blueprint
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Tokyo Odyssey */}
            <div className="bg-white rounded-3xl overflow-hidden border border-[#dec0bc]/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="relative h-60 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"
                  alt="Tokyo Neon & Shrines"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#a4362d]">
                  7 Days • Japan
                </div>
                <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs">
                  teamLab Art, Edomae Omakase & Herbal Speakeasies
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-[#181c1d] group-hover:text-[#a4362d] transition-colors">
                    Tokyo: Neon & Sacred Groves
                  </h3>
                  <p className="text-xs text-[#57423f] mt-2 line-clamp-2">
                    A modern master itinerary harmonizing digital sensory installations, Tsukiji fish alleys, and serene Meiji shrine walks.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#dec0bc]/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-[#8b716e] font-semibold">Est. Budget</span>
                    <p className="text-sm font-bold text-[#181c1d]">$2,200 / person</p>
                  </div>
                  <button
                    id="explore-tokyo-preset-btn"
                    onClick={() => handleQuickPreset('Tokyo', 7)}
                    className="px-4 py-2 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm transition-all"
                  >
                    Open Blueprint
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Grid Explorer */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#a4362d]">
            Curated Global Catalog
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d] mt-2">
            Where would you like to travel next?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDestinations.map(dest => (
            <div
              key={dest.name}
              onClick={() => handleSelectDestination(dest)}
              className="bg-white rounded-2xl overflow-hidden border border-[#dec0bc]/50 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-3 left-3 text-white">
                  <h4 className="font-serif text-xl font-bold">{dest.name}</h4>
                  <p className="text-xs text-[#ffdad5]">{dest.country}</p>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-[#57423f] line-clamp-2 mb-3">{dest.tagline}</p>
                <div className="flex items-center justify-between text-xs font-semibold text-[#a4362d] pt-2 border-t border-[#dec0bc]/30">
                  <span>From ~${dest.avgDailyBudget}/day</span>
                  <span className="flex items-center">
                    Plan <span className="material-symbols-outlined text-sm ml-0.5">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial Quote / Monograph Footer Callout */}
      <section className="bg-[#57423f] text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="material-symbols-outlined text-4xl text-[#ffdad5] mb-4">
            format_quote
          </span>
          <blockquote className="font-serif text-2xl sm:text-3xl italic font-normal leading-relaxed text-[#ffdad5]">
            "To travel is to discover that everyone is wrong about other countries. Curation is the art of leaving out the noise so the music can be heard."
          </blockquote>
          <p className="text-xs uppercase tracking-widest text-[#dec0bc] mt-6 font-semibold">
            TripBuilder Philosophy • 2026 Edition
          </p>
        </div>
      </section>
    </div>
  );
};

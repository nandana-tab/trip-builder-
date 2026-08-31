import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';

interface TripSummaryViewProps {
  onBackToItinerary: () => void;
  onNavigateToDashboard: () => void;
}

export const TripSummaryView: React.FC<TripSummaryViewProps> = ({
  onBackToItinerary,
  onNavigateToDashboard
}) => {
  const { activeTripId, getTripById, getTripItems, calculateBudgetBreakdown } = useTrip();
  const [copied, setCopied] = useState(false);

  const trip = activeTripId ? getTripById(activeTripId) : null;
  const items = activeTripId ? getTripItems(activeTripId) : [];
  const budget = activeTripId
    ? calculateBudgetBreakdown(activeTripId)
    : {
        accommodations: 0,
        dining: 0,
        activities: 0,
        transport_other: 0,
        total_estimated: 0,
        budget_goal: 3000,
        difference: 0
      };

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#f7fafb] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center border border-[#dec0bc]">
          <p className="text-sm font-semibold text-[#181c1d]">No active trip found</p>
          <button
            onClick={onNavigateToDashboard}
            className="mt-4 px-6 py-2 rounded-full bg-[#a4362d] text-white text-xs font-semibold"
          >
            Go to My Journeys
          </button>
        </div>
      </div>
    );
  }

  const daysCount = trip.duration_days;
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  const shareableUrl = `${window.location.origin}${window.location.pathname}#share/${trip.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#f7fafb] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between print:hidden">
          <button
            id="summary-back-itinerary-btn"
            onClick={onBackToItinerary}
            className="flex items-center space-x-1.5 text-xs font-semibold text-[#57423f] hover:text-[#a4362d] transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Edit Itinerary Canvas</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              id="summary-print-btn"
              onClick={handlePrint}
              className="px-4 py-2 rounded-full border border-[#dec0bc] text-[#57423f] hover:bg-[#ffdad5]/30 text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Export Monograph</span>
            </button>

            <button
              id="summary-copy-share-btn"
              onClick={handleCopyLink}
              className="px-5 py-2 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <span className="material-symbols-outlined text-base">
                {copied ? 'check' : 'share'}
              </span>
              <span>{copied ? 'Link Copied!' : 'Share Itinerary'}</span>
            </button>
          </div>
        </div>

        {/* Editorial Hero Monograph Header */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[#dec0bc]/80 shadow-md">
          <div className="relative h-72 sm:h-80 overflow-hidden">
            <img
              src={trip.destination_image}
              alt={trip.destination}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

            <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-[#a4362d] flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-sm">verified</span>
              <span>TripBuilder Curated Monograph</span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="text-xs uppercase tracking-widest text-[#ffdad5] font-semibold mb-1">
                {trip.destination_country} • {trip.duration_days} Days / {Math.max(1, trip.duration_days - 1)} Nights
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
                {trip.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 bg-[#f7fafb] border-t border-[#dec0bc]/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white rounded-2xl border border-[#dec0bc]/40">
              <span className="text-[10px] uppercase font-bold text-[#8b716e]">Dates</span>
              <p className="font-bold text-xs sm:text-sm text-[#181c1d] mt-0.5">{trip.start_date}</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#dec0bc]/40">
              <span className="text-[10px] uppercase font-bold text-[#8b716e]">Party</span>
              <p className="font-bold text-xs sm:text-sm text-[#181c1d] mt-0.5">
                {trip.travel_group.size} Guest{trip.travel_group.size > 1 ? 's' : ''} ({trip.travel_group.type})
              </p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#dec0bc]/40">
              <span className="text-[10px] uppercase font-bold text-[#8b716e]">Pace</span>
              <p className="font-bold text-xs sm:text-sm text-[#181c1d] mt-0.5">{trip.fine_tune.pace}</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#dec0bc]/40">
              <span className="text-[10px] uppercase font-bold text-[#8b716e]">Fiscal Tier</span>
              <p className="font-bold text-xs sm:text-sm text-[#a4362d] uppercase mt-0.5">{trip.budget_tier}</p>
            </div>
          </div>
        </div>

        {/* Fiscal Overview Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dec0bc]/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-[#a4362d]">
                Financial Summary
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#181c1d] mt-0.5">
                Fiscal Overview
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#8b716e] uppercase font-semibold">Total Estimated Cost</span>
              <p className="text-2xl font-serif font-bold text-[#a4362d]">
                ${budget.total_estimated.toLocaleString()}{' '}
                <span className="text-xs font-sans text-[#57423f]">/ ${budget.budget_goal.toLocaleString()}</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#dec0bc]/40">
            <div className="p-4 rounded-2xl bg-[#f7fafb] border border-[#dec0bc]/50">
              <div className="flex items-center space-x-2 text-xs text-[#57423f] mb-1">
                <span className="material-symbols-outlined text-sm text-[#a4362d]">hotel</span>
                <span className="font-semibold">Accommodations</span>
              </div>
              <p className="font-serif text-xl font-bold text-[#181c1d]">
                ${budget.accommodations.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7fafb] border border-[#dec0bc]/50">
              <div className="flex items-center space-x-2 text-xs text-[#57423f] mb-1">
                <span className="material-symbols-outlined text-sm text-[#a4362d]">restaurant</span>
                <span className="font-semibold">Dining & Tastings</span>
              </div>
              <p className="font-serif text-xl font-bold text-[#181c1d]">
                ${budget.dining.toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7fafb] border border-[#dec0bc]/50">
              <div className="flex items-center space-x-2 text-xs text-[#57423f] mb-1">
                <span className="material-symbols-outlined text-sm text-[#a4362d]">explore</span>
                <span className="font-semibold">Activities & Passes</span>
              </div>
              <p className="font-serif text-xl font-bold text-[#181c1d]">
                ${budget.activities.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Journey Rhythm: Day-by-Day Story Timeline */}
        <div className="space-y-6">
          <div className="text-center sm:text-left">
            <span className="text-xs uppercase font-bold tracking-wider text-[#a4362d]">
              Chronological Monograph
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#181c1d] mt-1">
              Journey Rhythm
            </h2>
          </div>

          <div className="space-y-6">
            {daysArray.map(dayNum => {
              const dayItems = items.filter(i => i.day_number === dayNum);

              return (
                <div
                  key={dayNum}
                  className="bg-white rounded-3xl p-6 sm:p-8 border border-[#dec0bc]/80 shadow-sm space-y-4"
                >
                  <div className="flex items-center space-x-3 pb-3 border-b border-[#dec0bc]/40">
                    <div className="w-8 h-8 rounded-xl bg-[#a4362d] text-white flex items-center justify-center font-bold text-xs">
                      D{dayNum}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#181c1d]">
                      Day {dayNum} Overview
                    </h3>
                  </div>

                  {dayItems.length === 0 ? (
                    <p className="text-xs text-[#8b716e] italic">
                      Open day for spontaneous exploration, market strolls, and relaxation.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {dayItems.map(item => (
                        <div
                          key={item.id}
                          className="bg-[#f7fafb] rounded-2xl p-4 border border-[#dec0bc]/50 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between text-[10px] font-bold text-[#a4362d] mb-1">
                              <span className="uppercase">{item.time_slot}</span>
                              <span>${item.recommendation.estimated_cost_usd}</span>
                            </div>
                            <h4 className="font-serif text-sm font-bold text-[#181c1d]">
                              {item.recommendation.name}
                            </h4>
                            <p className="text-[11px] text-[#57423f] mt-1 line-clamp-2">
                              {item.recommendation.description}
                            </p>
                          </div>
                          <span className="text-[10px] text-[#8b716e] font-semibold mt-3 block">
                            📍 {item.recommendation.location_area}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Shareable Link Box */}
        <div className="bg-[#ffdad5]/30 rounded-3xl p-6 sm:p-8 border border-[#dec0bc] text-center space-y-4 print:hidden">
          <span className="material-symbols-outlined text-3xl text-[#a4362d]">link</span>
          <h3 className="font-serif text-xl font-bold text-[#181c1d]">Share this Blueprint with Travel Companions</h3>
          <p className="text-xs text-[#57423f] max-w-md mx-auto">
            Anyone with this unique link can view this complete day-by-day monograph without needing an account.
          </p>

          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="flex-1 px-4 py-2 rounded-xl bg-white border border-[#dec0bc] text-xs text-[#181c1d] select-all outline-none"
            />
            <button
              onClick={handleCopyLink}
              className="px-5 py-2 rounded-xl bg-[#a4362d] text-white text-xs font-semibold hover:bg-[#8b2d25] transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

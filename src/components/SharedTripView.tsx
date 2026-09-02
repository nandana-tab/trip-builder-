import React from 'react';
import { useTrip } from '../context/TripContext';
import { formatCurrency } from '../utils/currency';

interface SharedTripViewProps {
  tripId: string;
  onPlanYourOwn: () => void;
}

export const SharedTripView: React.FC<SharedTripViewProps> = ({ tripId, onPlanYourOwn }) => {
  const { getTripById, getTripItems, calculateBudgetBreakdown } = useTrip();

  const trip = getTripById(tripId);
  const items = tripId ? getTripItems(tripId) : [];
  const budget = tripId
    ? calculateBudgetBreakdown(tripId)
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
        <div className="bg-white rounded-3xl p-8 text-center border border-[#dec0bc] max-w-md">
          <span className="material-symbols-outlined text-4xl text-[#a4362d] mb-2">travel_explore</span>
          <h2 className="font-serif text-2xl font-bold">Shared Journey Not Found</h2>
          <p className="text-xs text-[#57423f] mt-1 mb-4">This link may have expired or been moved.</p>
          <button
            onClick={onPlanYourOwn}
            className="px-6 py-2.5 rounded-full bg-[#a4362d] text-white text-xs font-semibold"
          >
            Plan Your Own Journey
          </button>
        </div>
      </div>
    );
  }

  const daysArray = Array.from({ length: trip.duration_days }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#f7fafb] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Public Banner */}
        <div className="bg-white rounded-2xl p-4 border border-[#dec0bc] shadow-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-full bg-[#a4362d] text-white flex items-center justify-center font-bold text-xs">
              TB
            </span>
            <div>
              <p className="text-xs font-bold text-[#181c1d]">Shared via TripBuilder</p>
              <p className="text-[10px] text-[#8b716e]">AI-Curated Travel Monograph</p>
            </div>
          </div>
          <button
            onClick={onPlanYourOwn}
            className="px-4 py-2 rounded-full bg-[#a4362d] text-white text-xs font-semibold hover:bg-[#8b2d25] transition-all"
          >
            Plan Your Own Trip
          </button>
        </div>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-[#dec0bc]/80 shadow-md">
          <div className="relative h-72 sm:h-80 overflow-hidden">
            <img
              src={trip.destination_image}
              alt={trip.destination}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="text-xs uppercase tracking-widest text-[#ffdad5] font-semibold">
                {trip.destination_country} • {trip.duration_days} Days / {Math.max(1, trip.duration_days - 1)} Nights
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mt-1">
                {trip.title}
              </h1>
            </div>
          </div>

          <div className="p-6 bg-[#f7fafb] border-t border-[#dec0bc]/40 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-white rounded-2xl border border-[#dec0bc]/40">
              <span className="text-[10px] uppercase font-bold text-[#8b716e]">Dates</span>
              <p className="font-bold text-xs text-[#181c1d] mt-0.5">{trip.start_date}</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#dec0bc]/40">
              <span className="text-[10px] uppercase font-bold text-[#8b716e]">Party</span>
              <p className="font-bold text-xs text-[#181c1d] mt-0.5">{trip.travel_group.size} ({trip.travel_group.type})</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#dec0bc]/40">
              <span className="text-[10px] uppercase font-bold text-[#8b716e]">Pace</span>
              <p className="font-bold text-xs text-[#181c1d] mt-0.5">{trip.fine_tune.pace}</p>
            </div>
            <div className="p-3 bg-white rounded-2xl border border-[#dec0bc]/40">
              <span className="text-[10px] uppercase font-bold text-[#8b716e]">Est. Budget</span>
              <p className="font-bold text-xs text-[#a4362d] mt-0.5">{formatCurrency(budget.total_estimated, trip.currency)}</p>
            </div>
          </div>
        </div>

        {/* Day-by-Day Timeline */}
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-[#181c1d]">
            Journey Itinerary
          </h2>

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
                    Day {dayNum} Schedule
                  </h3>
                </div>

                {dayItems.length === 0 ? (
                  <p className="text-xs text-[#8b716e] italic">Leisure & free exploration.</p>
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
                            <span>{formatCurrency(item.recommendation.estimated_cost_usd, trip.currency)}</span>
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

        {/* CTA Banner */}
        <div className="bg-[#ffdad5]/40 rounded-3xl p-8 border border-[#dec0bc] text-center space-y-3">
          <h3 className="font-serif text-2xl font-bold text-[#181c1d]">
            Ready to plan your own dream voyage?
          </h3>
          <p className="text-xs text-[#57423f] max-w-md mx-auto">
            Design an AI-curated itinerary tailored to your passions, palate, and budget in under 2 minutes.
          </p>
          <button
            onClick={onPlanYourOwn}
            className="px-8 py-3 rounded-full bg-[#a4362d] text-white text-xs font-semibold hover:bg-[#8b2d25] shadow-md transition-all inline-flex items-center space-x-2"
          >
            <span>Start Planning with TripBuilder</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useTrip } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { POPULAR_DESTINATIONS } from '../data/seedData';
import { formatCurrency } from '../utils/currency';

interface MyTripsDashboardProps {
  onOpenTrip: (tripId: string) => void;
  onStartNewTrip: () => void;
}

export const MyTripsDashboard: React.FC<MyTripsDashboardProps> = ({
  onOpenTrip,
  onStartNewTrip
}) => {
  const { trips, deleteTrip, calculateBudgetBreakdown } = useTrip();
  const { user } = useAuth();
  const [tripToDelete, setTripToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (tripToDelete) {
      deleteTrip(tripToDelete);
      setTripToDelete(null);
    }
  };

  const calculateDaysUntil = (startDateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDateStr);
    const diffTime = start.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-[#f7fafb] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#dec0bc]/50">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d]">
              Personal Travel Portfolio
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d] mt-1">
              Your Journeys
            </h1>
            <p className="text-xs sm:text-sm text-[#57423f] mt-1">
              {user ? `Curated travel blueprints for ${user.displayName}` : 'Curated travel blueprints and saved adventures'}
            </p>
          </div>

          <button
            id="dashboard-plan-new-trip-btn"
            onClick={onStartNewTrip}
            className="self-start sm:self-auto px-6 py-3 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center space-x-2"
          >
            <span className="material-symbols-outlined text-base">add_circle</span>
            <span>Plan New Journey</span>
          </button>
        </div>

        {/* Current & Upcoming Journeys */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#181c1d]">
              Current & Upcoming Trips ({trips.length})
            </h2>
          </div>

          {trips.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#dec0bc]/70 shadow-sm max-w-md mx-auto">
              <span className="material-symbols-outlined text-5xl text-[#a4362d] mb-3">
                luggage
              </span>
              <h3 className="font-serif text-xl font-bold text-[#181c1d]">No journeys planned yet</h3>
              <p className="text-xs text-[#57423f] mt-1 mb-6">
                Start your first bespoke itinerary with our AI curation wizard.
              </p>
              <button
                onClick={onStartNewTrip}
                className="px-6 py-2.5 rounded-full bg-[#a4362d] text-white text-xs font-semibold shadow-sm hover:bg-[#8b2d25]"
              >
                Plan a Trip Now
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map(trip => {
                const daysUntil = calculateDaysUntil(trip.start_date);
                const budget = calculateBudgetBreakdown(trip.id);

                return (
                  <div
                    key={trip.id}
                    id={`trip-card-${trip.id}`}
                    className="bg-white rounded-3xl overflow-hidden border border-[#dec0bc]/70 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image header with countdown badge */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={trip.destination_image}
                          alt={trip.destination}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

                        {daysUntil > 0 ? (
                          <div className="absolute top-3 left-3 bg-[#a4362d] text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center space-x-1">
                            <span className="material-symbols-outlined text-xs">flight_takeoff</span>
                            <span>In {daysUntil} days</span>
                          </div>
                        ) : (
                          <div className="absolute top-3 left-3 bg-emerald-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                            Active / Ready
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 text-white">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-[#ffdad5]">
                            {trip.destination_country} • {trip.duration_days} Days
                          </span>
                          <h3 className="font-serif text-xl font-bold">{trip.title}</h3>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs text-[#57423f]">
                          <span className="flex items-center space-x-1">
                            <span className="material-symbols-outlined text-sm text-[#8b716e]">calendar_month</span>
                            <span>{trip.start_date}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <span className="material-symbols-outlined text-sm text-[#8b716e]">group</span>
                            <span>{trip.travel_group.size} ({trip.travel_group.type})</span>
                          </span>
                        </div>

                        {/* Budget Bar */}
                        <div className="p-3 bg-[#f7fafb] rounded-2xl border border-[#dec0bc]/40 space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-[#8b716e]">Est. Cost:</span>
                            <span className="font-bold text-[#181c1d]">
                              {formatCurrency(budget.total_estimated, trip.currency)} / {formatCurrency(budget.budget_goal, trip.currency)}
                            </span>
                          </div>
                          <div className="w-full bg-[#dec0bc]/30 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#a4362d] h-full rounded-full"
                              style={{
                                width: `${Math.min(100, (budget.total_estimated / (budget.budget_goal || 1)) * 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {trip.priority_tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] font-semibold text-[#a4362d] bg-[#ffdad5]/50 px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 bg-[#f7fafb] border-t border-[#dec0bc]/40 flex items-center justify-between">
                      <button
                        id={`delete-trip-${trip.id}`}
                        type="button"
                        onClick={() => setTripToDelete(trip.id)}
                        className="p-2 rounded-xl text-[#8b716e] hover:text-[#ba1a1a] hover:bg-[#ba1a1a]/10 transition-colors"
                        title="Delete Journey"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>

                      <button
                        id={`open-trip-btn-${trip.id}`}
                        onClick={() => onOpenTrip(trip.id)}
                        className="px-4 py-2 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1"
                      >
                        <span>Open Canvas</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Saved Inspirations Catalog */}
        <div className="space-y-4 pt-6 border-t border-[#dec0bc]/40">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#a4362d]">
                Inspiration Hub
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#181c1d]">
                Featured Destination Blueprints
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {POPULAR_DESTINATIONS.slice(0, 4).map(dest => (
              <div
                key={dest.name}
                onClick={onStartNewTrip}
                className="bg-white rounded-2xl overflow-hidden border border-[#dec0bc]/50 shadow-xs hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="h-28 overflow-hidden relative">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-2 left-2 text-white">
                    <p className="font-serif font-bold text-sm">{dest.name}</p>
                    <p className="text-[10px] text-[#ffdad5]">{dest.country}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-[#dec0bc]">
            <div className="w-12 h-12 rounded-full bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">delete_forever</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#181c1d]">Delete Journey?</h3>
            <p className="text-xs text-[#57423f] mt-1 mb-6">
              This will permanently remove this itinerary and all custom scheduled items.
            </p>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setTripToDelete(null)}
                className="flex-1 py-2.5 rounded-xl border border-[#dec0bc] text-xs font-semibold text-[#57423f] hover:bg-[#f7fafb]"
              >
                Cancel
              </button>
              <button
                id="confirm-delete-trip-btn"
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-[#ba1a1a] text-white text-xs font-semibold hover:bg-red-700 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

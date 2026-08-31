import React, { useState, useMemo } from 'react';
import { useTrip } from '../context/TripContext';
import { TimeSlot, Recommendation, SelectedItem } from '../types';
import {
  getTransitMetrics,
  calculateDistanceKm,
  getBaseHotelForTrip,
  analyzeDayEaseForRecommendation,
  TransitInfo
} from '../utils/distanceUtils';

interface ItineraryViewProps {
  onNavigateToSummary: () => void;
  onNavigateToRecommendations: () => void;
  onShareTrip: () => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  onNavigateToSummary,
  onNavigateToRecommendations,
  onShareTrip
}) => {
  const {
    activeTripId,
    getTripById,
    getTripItems,
    removeSelectedItem,
    swapSelectedItem,
    moveSelectedItem,
    calculateBudgetBreakdown,
    getAlternativeRecommendations,
    recommendations
  } = useTrip();

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

  const [activeDayFilter, setActiveDayFilter] = useState<number | 'all'>('all');
  const [swappingItemId, setSwappingItemId] = useState<string | null>(null);
  const [swapCategoryFilter, setSwapCategoryFilter] = useState<string>('All');
  const [swapSearchQuery, setSwapSearchQuery] = useState<string>('');
  const [movingItemId, setMovingItemId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Find base hotel for proximity anchoring
  const baseHotel = useMemo(() => {
    if (!trip) return undefined;
    return getBaseHotelForTrip(items, recommendations, trip.destination);
  }, [items, recommendations, trip]);

  if (!trip) {
    return (
      <div className="min-h-screen bg-[#f7fafb] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 text-center border border-[#dec0bc] max-w-md">
          <span className="material-symbols-outlined text-4xl text-[#a4362d] mb-2">map</span>
          <h2 className="font-serif text-2xl font-bold">No active trip selected</h2>
          <button
            onClick={onNavigateToRecommendations}
            className="mt-4 px-6 py-2 rounded-full bg-[#a4362d] text-white text-xs font-semibold"
          >
            Create or Select a Journey
          </button>
        </div>
      </div>
    );
  }

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const daysCount = trip.duration_days;
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);
  const displayedDays = activeDayFilter === 'all' ? daysArray : [activeDayFilter];
  const timeSlots: TimeSlot[] = ['Morning', 'Afternoon', 'Evening'];

  // Current item being swapped
  const swappingItem = swappingItemId ? items.find(i => i.id === swappingItemId) : null;
  const rawAlternatives = swappingItem
    ? getAlternativeRecommendations(swappingItem.recommendation_id)
    : [];

  // Filter alternatives by category and search
  const filteredAlternatives = rawAlternatives.filter(alt => {
    const matchesCategory =
      swapCategoryFilter === 'All'
        ? true
        : swapCategoryFilter === 'Same Category'
        ? alt.category === swappingItem?.recommendation.category
        : alt.category === swapCategoryFilter;

    const matchesSearch =
      !swapSearchQuery.trim() ||
      alt.name.toLowerCase().includes(swapSearchQuery.toLowerCase()) ||
      alt.description.toLowerCase().includes(swapSearchQuery.toLowerCase()) ||
      alt.location_area.toLowerCase().includes(swapSearchQuery.toLowerCase()) ||
      alt.tags.some(t => t.toLowerCase().includes(swapSearchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleExecuteSwap = (altRec: Recommendation) => {
    if (!swappingItemId) return;
    swapSelectedItem(swappingItemId, altRec.id);
    setSwappingItemId(null);
    setSwapCategoryFilter('All');
    setSwapSearchQuery('');
    showToast(`Swapped to ${altRec.name}!`);
  };

  const handleMove = (newDay: number, newSlot: TimeSlot) => {
    if (!movingItemId) return;
    moveSelectedItem(movingItemId, newDay, newSlot);
    setMovingItemId(null);
    showToast(`Moved item to Day ${newDay} (${newSlot})`);
  };

  const budgetPercent = Math.min(100, Math.round((budget.total_estimated / (budget.budget_goal || 1)) * 100));

  // Item being moved for ease analysis
  const itemBeingMoved = movingItemId ? items.find(i => i.id === movingItemId) : null;
  const moveDayAnalyses = itemBeingMoved
    ? analyzeDayEaseForRecommendation(itemBeingMoved.recommendation, daysCount, items, baseHotel)
    : [];

  return (
    <div className="min-h-screen bg-[#f7fafb] pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#181c1d] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/20 text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-base text-[#ffdad5]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border-b border-[#dec0bc]/50 py-6 px-4 sm:px-6 lg:px-8 sticky top-18 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-[#57423f] mb-1">
              <span className="font-semibold text-[#a4362d]">{trip.destination}, {trip.destination_country}</span>
              <span>•</span>
              <span>{trip.start_date} to {trip.end_date}</span>
              <span>•</span>
              <span>{trip.travel_group.size} Traveler{trip.travel_group.size > 1 ? 's' : ''} ({trip.travel_group.type})</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181c1d]">
              {trip.title}
            </h1>
            {baseHotel && (
              <div className="mt-1 flex items-center space-x-1.5 text-xs text-[#57423f]">
                <span className="material-symbols-outlined text-sm text-[#a4362d]">hotel</span>
                <span>Base Stay: <strong className="text-[#181c1d]">{baseHotel.name}</strong> ({baseHotel.location_area})</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="itinerary-add-more-recs-btn"
              onClick={onNavigateToRecommendations}
              className="px-4 py-2 rounded-full border border-[#dec0bc] text-[#57423f] hover:bg-[#ffdad5]/30 text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <span className="material-symbols-outlined text-base">add</span>
              <span>Explore Spots</span>
            </button>

            <button
              id="itinerary-share-btn"
              onClick={onShareTrip}
              className="px-4 py-2 rounded-full border border-[#a4362d] text-[#a4362d] hover:bg-[#ffdad5]/40 text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <span className="material-symbols-outlined text-base">share</span>
              <span>Share</span>
            </button>

            <button
              id="itinerary-view-summary-btn"
              onClick={onNavigateToSummary}
              className="px-5 py-2 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-1.5"
            >
              <span className="material-symbols-outlined text-base">receipt_long</span>
              <span>Finalize & Summary</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Itinerary Canvas + Blueprint Sidebar */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Main Column: Days Tabs & Day-by-Day Schedule */}
          <div className="lg:col-span-8 space-y-6">
            {/* Day Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                id="day-filter-all"
                onClick={() => setActiveDayFilter('all')}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  activeDayFilter === 'all'
                    ? 'bg-[#a4362d] text-white shadow-sm'
                    : 'bg-white text-[#57423f] hover:bg-[#ffdad5]/40 border border-[#dec0bc]/60'
                }`}
              >
                All Days ({daysCount})
              </button>

              {daysArray.map(dayNum => (
                <button
                  key={dayNum}
                  id={`day-filter-day-${dayNum}`}
                  onClick={() => setActiveDayFilter(dayNum)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeDayFilter === dayNum
                      ? 'bg-[#a4362d] text-white shadow-sm'
                      : 'bg-white text-[#57423f] hover:bg-[#ffdad5]/40 border border-[#dec0bc]/60'
                  }`}
                >
                  Day {dayNum}
                </button>
              ))}
            </div>

            {/* Render Each Day Card */}
            {displayedDays.map(dayNumber => {
              const dayItems = items.filter(i => i.day_number === dayNumber);

              // Calculate chronological order of items for the day
              const sortedDayItems = [...dayItems].sort((a, b) => {
                const slotOrder = { Morning: 0, Afternoon: 1, Evening: 2 };
                if (slotOrder[a.time_slot] !== slotOrder[b.time_slot]) {
                  return slotOrder[a.time_slot] - slotOrder[b.time_slot];
                }
                return a.order_index - b.order_index;
              });

              // Compute total day transit distance
              let totalDayDistanceKm = 0;
              for (let idx = 0; idx < sortedDayItems.length; idx++) {
                const curr = sortedDayItems[idx];
                const prev = idx > 0 ? sortedDayItems[idx - 1] : undefined;
                if (prev) {
                  totalDayDistanceKm += calculateDistanceKm(
                    prev.recommendation.coordinates,
                    curr.recommendation.coordinates
                  );
                } else if (baseHotel?.coordinates && curr.recommendation.coordinates) {
                  totalDayDistanceKm += calculateDistanceKm(
                    baseHotel.coordinates,
                    curr.recommendation.coordinates
                  );
                }
              }
              totalDayDistanceKm = Math.round(totalDayDistanceKm * 10) / 10;

              return (
                <div
                  key={dayNumber}
                  id={`itinerary-day-section-${dayNumber}`}
                  className="bg-white rounded-3xl border border-[#dec0bc]/70 shadow-sm overflow-hidden"
                >
                  {/* Day Header */}
                  <div className="bg-[#ffdad5]/20 px-6 py-4 border-b border-[#dec0bc]/50 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-2xl bg-[#a4362d] text-white flex items-center justify-center font-bold text-sm">
                        D{dayNumber}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-serif text-lg font-bold text-[#181c1d]">
                            Day {dayNumber}
                          </h3>
                          {dayItems.length > 0 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                              {totalDayDistanceKm <= 3.0 ? '⚡ Walkable & Compact' : totalDayDistanceKm <= 8.0 ? '🚖 Seamless Transit' : '🗺️ Multi-District'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#57423f]">
                          {dayItems.length} planned experience{dayItems.length !== 1 ? 's' : ''} • ~{totalDayDistanceKm} km total day travel
                        </p>
                      </div>
                    </div>

                    <button
                      id={`add-spot-day-${dayNumber}`}
                      onClick={onNavigateToRecommendations}
                      className="text-xs font-semibold text-[#a4362d] hover:text-[#8b2d25] flex items-center space-x-1"
                    >
                      <span className="material-symbols-outlined text-sm">add_circle</span>
                      <span>Add Spot</span>
                    </button>
                  </div>

                  {/* Day Slots */}
                  <div className="p-6 space-y-6">
                    {timeSlots.map(slot => {
                      const slotItems = dayItems.filter(i => i.time_slot === slot);

                      return (
                        <div key={slot} className="space-y-3">
                          <div className="flex items-center space-x-2">
                            <span className="material-symbols-outlined text-sm text-[#8b716e]">
                              {slot === 'Morning' ? 'wb_sunny' : slot === 'Afternoon' ? 'wb_twilight' : 'nights_stay'}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#8b716e]">
                              {slot}
                            </span>
                            <div className="flex-1 border-b border-[#dec0bc]/30"></div>
                          </div>

                          {slotItems.length === 0 ? (
                            <div className="p-4 rounded-2xl border border-dashed border-[#dec0bc]/60 bg-[#f7fafb] text-center text-xs text-[#8b716e]">
                              <span>Free leisure & exploration window</span>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {slotItems.map(item => {
                                // Find previous item in the day's timeline
                                const currentIndexInSorted = sortedDayItems.findIndex(i => i.id === item.id);
                                const prevItem = currentIndexInSorted > 0 ? sortedDayItems[currentIndexInSorted - 1] : undefined;

                                // Compute transit metrics from previous stop or hotel base
                                const transitInfo: TransitInfo = prevItem
                                  ? getTransitMetrics(
                                      prevItem.recommendation.coordinates,
                                      item.recommendation.coordinates,
                                      1.4
                                    )
                                  : getTransitMetrics(
                                      baseHotel?.coordinates,
                                      item.recommendation.coordinates,
                                      1.8
                                    );

                                const originLabel = prevItem
                                  ? `from ${prevItem.recommendation.name}`
                                  : baseHotel
                                  ? `from Hotel (${baseHotel.name})`
                                  : 'from Day Start Point';

                                return (
                                  <div key={item.id} className="space-y-2">
                                    {/* Transit Connector Ribbon if this is not the very first activity */}
                                    {prevItem && (
                                      <div className="flex items-center space-x-2 py-1 px-3 rounded-xl bg-[#f7fafb] border border-[#dec0bc]/50 text-[11px] text-[#57423f] w-fit">
                                        <span className="material-symbols-outlined text-sm text-[#a4362d]">
                                          {transitInfo.modeIcon}
                                        </span>
                                        <span className="font-semibold">{transitInfo.formattedDuration}</span>
                                        <span>({transitInfo.formattedDistance})</span>
                                        <span className="text-[#8b716e]">• {transitInfo.modeLabel}</span>
                                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${transitInfo.easeBadgeClass}`}>
                                          {transitInfo.easeLevel}
                                        </span>
                                      </div>
                                    )}

                                    {/* Main Item Card */}
                                    <div
                                      id={`itinerary-item-${item.id}`}
                                      className="bg-white rounded-2xl p-4 border border-[#dec0bc]/80 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                                    >
                                      <div className="flex items-start sm:items-center space-x-4">
                                        <img
                                          src={item.recommendation.image_url}
                                          alt={item.recommendation.name}
                                          className="w-16 h-16 rounded-xl object-cover ring-1 ring-[#dec0bc] shrink-0"
                                        />
                                        <div>
                                          <div className="flex flex-wrap items-center gap-1.5">
                                            <span className="text-[10px] font-bold uppercase text-[#a4362d] bg-[#ffdad5]/60 px-2 py-0.5 rounded">
                                              {item.recommendation.category}
                                            </span>
                                            <span className="text-xs font-semibold text-[#57423f]">
                                              {item.recommendation.location_area}
                                            </span>
                                          </div>
                                          <h4 className="font-serif text-base font-bold text-[#181c1d] mt-0.5">
                                            {item.recommendation.name}
                                          </h4>
                                          <p className="text-[11px] text-[#57423f] line-clamp-1 mt-0.5">
                                            {item.custom_notes || item.recommendation.description}
                                          </p>

                                          {/* Proximity & Ease Badge */}
                                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px]">
                                            <span className="inline-flex items-center space-x-1 font-semibold text-[#57423f] bg-[#ffdad5]/30 px-2 py-0.5 rounded-full border border-[#dec0bc]/40">
                                              <span className="material-symbols-outlined text-xs text-[#a4362d]">near_me</span>
                                              <span>{transitInfo.formattedDistance} {originLabel} ({transitInfo.formattedDuration})</span>
                                            </span>

                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-bold border ${transitInfo.easeBadgeClass}`}>
                                              <span>{transitInfo.easeLevel} transit</span>
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                                        <span className="text-xs font-bold text-[#181c1d] mr-2">
                                          ${item.recommendation.estimated_cost_usd}
                                        </span>

                                        {/* Swap Button */}
                                        <button
                                          id={`swap-btn-${item.id}`}
                                          type="button"
                                          title="Swap with curated alternative"
                                          onClick={() => setSwappingItemId(item.id)}
                                          className="p-2 rounded-xl bg-[#ffdad5]/30 hover:bg-[#ffdad5] text-[#a4362d] text-xs font-semibold transition-colors flex items-center space-x-1"
                                        >
                                          <span className="material-symbols-outlined text-base">swap_horiz</span>
                                          <span className="hidden sm:inline">Swap</span>
                                        </button>

                                        {/* Move / Reschedule Button */}
                                        <button
                                          id={`move-btn-${item.id}`}
                                          type="button"
                                          title="Move to another Day or Slot"
                                          onClick={() => setMovingItemId(item.id)}
                                          className="p-2 rounded-xl bg-[#f7fafb] hover:bg-[#dec0bc]/30 text-[#57423f] transition-colors"
                                        >
                                          <span className="material-symbols-outlined text-base">schedule</span>
                                        </button>

                                        {/* Remove Button */}
                                        <button
                                          id={`remove-btn-${item.id}`}
                                          type="button"
                                          title="Remove from itinerary"
                                          onClick={() => {
                                            removeSelectedItem(item.id);
                                            showToast(`Removed ${item.recommendation.name}`);
                                          }}
                                          className="p-2 rounded-xl text-[#ba1a1a] hover:bg-[#ba1a1a]/10 transition-colors"
                                        >
                                          <span className="material-symbols-outlined text-base">delete</span>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: The Blueprint & Live Budget Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* The Blueprint Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#dec0bc]/80 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-[#a4362d] text-2xl">architecture</span>
                <h3 className="font-serif text-xl font-bold text-[#181c1d]">The Blueprint</h3>
              </div>
              <p className="text-xs text-[#57423f]">
                Calibrated parameters governing your itinerary curation.
              </p>

              <div className="space-y-3 pt-2 border-t border-[#dec0bc]/40">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8b716e] font-semibold">Itinerary Pace:</span>
                  <span className="font-bold text-[#181c1d] bg-[#ffdad5]/40 px-2 py-0.5 rounded">
                    {trip.fine_tune.pace}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8b716e] font-semibold">Travel Party:</span>
                  <span className="font-bold text-[#181c1d]">
                    {trip.travel_group.size} Traveler{trip.travel_group.size > 1 ? 's' : ''} ({trip.travel_group.type})
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8b716e] font-semibold">Duration:</span>
                  <span className="font-bold text-[#181c1d]">
                    {trip.duration_days} Days / {Math.max(1, trip.duration_days - 1)} Nights
                  </span>
                </div>

                {baseHotel && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#8b716e] font-semibold">Base Anchor:</span>
                    <span className="font-bold text-[#181c1d] truncate max-w-[160px]" title={baseHotel.name}>
                      {baseHotel.name}
                    </span>
                  </div>
                )}

                <div className="pt-2">
                  <span className="text-xs text-[#8b716e] font-semibold block mb-1.5">
                    Travel DNA Priorities:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {trip.priority_tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold text-[#a4362d] bg-[#ffdad5]/50 px-2 py-0.5 rounded-full"
                      >
                        ★ {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Tracker & Fiscal Balance */}
            <div className="bg-white rounded-3xl p-6 border border-[#dec0bc]/80 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="material-symbols-outlined text-[#a4362d] text-2xl">account_balance_wallet</span>
                  <h3 className="font-serif text-xl font-bold text-[#181c1d]">Fiscal Tracker</h3>
                </div>
                <span className="text-xs font-bold text-[#a4362d] bg-[#ffdad5]/50 px-2 py-0.5 rounded-full">
                  {trip.budget_tier.toUpperCase()}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#57423f]">Est. Spent: <strong className="text-[#181c1d]">${budget.total_estimated.toLocaleString()}</strong></span>
                  <span className="text-[#8b716e]">Goal: ${budget.budget_goal.toLocaleString()}</span>
                </div>
                <div className="w-full bg-[#dec0bc]/30 h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-full ${
                      budgetPercent > 100 ? 'bg-[#ba1a1a]' : 'bg-[#a4362d]'
                    }`}
                    style={{ width: `${Math.min(100, budgetPercent)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[11px] text-[#8b716e]">
                  <span>{budgetPercent}% allocated</span>
                  <span className={budget.difference >= 0 ? 'text-emerald-700 font-semibold' : 'text-[#ba1a1a] font-semibold'}>
                    {budget.difference >= 0
                      ? `$${budget.difference.toLocaleString()} remaining`
                      : `$${Math.abs(budget.difference).toLocaleString()} over budget`}
                  </span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-2.5 pt-3 border-t border-[#dec0bc]/40 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#57423f] flex items-center space-x-1.5">
                    <span className="material-symbols-outlined text-sm text-[#a4362d]">hotel</span>
                    <span>Accommodations</span>
                  </span>
                  <span className="font-bold text-[#181c1d]">${budget.accommodations.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#57423f] flex items-center space-x-1.5">
                    <span className="material-symbols-outlined text-sm text-[#a4362d]">restaurant</span>
                    <span>Dining & Tastings</span>
                  </span>
                  <span className="font-bold text-[#181c1d]">${budget.dining.toLocaleString()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[#57423f] flex items-center space-x-1.5">
                    <span className="material-symbols-outlined text-sm text-[#a4362d]">explore</span>
                    <span>Activities & Tours</span>
                  </span>
                  <span className="font-bold text-[#181c1d]">${budget.activities.toLocaleString()}</span>
                </div>

                {budget.transport_other > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-[#57423f] flex items-center space-x-1.5">
                      <span className="material-symbols-outlined text-sm text-[#a4362d]">directions_transit</span>
                      <span>Transit & Other</span>
                    </span>
                    <span className="font-bold text-[#181c1d]">${budget.transport_other.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <button
                id="sidebar-finalize-btn"
                onClick={onNavigateToSummary}
                className="w-full py-3 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm hover:shadow transition-all flex items-center justify-center space-x-2"
              >
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>Finalize Journey Monograph</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* SWAP MODAL */}
      {swappingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#dec0bc] relative max-h-[90vh] overflow-y-auto">
            <button
              id="close-swap-modal-btn"
              onClick={() => {
                setSwappingItemId(null);
                setSwapCategoryFilter('All');
                setSwapSearchQuery('');
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#8b716e] hover:bg-[#ffdad5]/40"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <div className="mb-5">
              <span className="text-xs uppercase font-bold tracking-wider text-[#a4362d]">
                Recommendation Swap
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#181c1d] mt-1">
                Swap Experience
              </h3>
              <p className="text-xs text-[#57423f] mt-1">
                Explore curated alternatives for{' '}
                <strong className="text-[#181c1d]">{swappingItem.recommendation.name}</strong> in {trip.destination}.
              </p>
            </div>

            {/* Current Item Card Summary */}
            <div className="p-3.5 rounded-2xl bg-[#ffdad5]/20 border border-[#dec0bc] mb-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={swappingItem.recommendation.image_url}
                  alt={swappingItem.recommendation.name}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#dec0bc]"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase text-[#a4362d] bg-[#ffdad5] px-1.5 py-0.5 rounded">
                      Current: {swappingItem.recommendation.category}
                    </span>
                    <span className="text-xs font-semibold text-[#57423f]">
                      Day {swappingItem.day_number} • {swappingItem.time_slot}
                    </span>
                  </div>
                  <h4 className="font-serif text-sm font-bold text-[#181c1d] mt-0.5">
                    {swappingItem.recommendation.name}
                  </h4>
                </div>
              </div>
              <span className="text-xs font-bold text-[#181c1d]">
                ${swappingItem.recommendation.estimated_cost_usd}
              </span>
            </div>

            {/* Filter Pills & Search in Modal */}
            <div className="space-y-3 mb-5">
              {/* Category Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
                {['All', 'Same Category', 'Attractions', 'Activities', 'Restaurants', 'Nightlife', 'Hotels', 'Shopping'].map(
                  cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSwapCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${
                        swapCategoryFilter === cat
                          ? 'bg-[#a4362d] text-white shadow-xs'
                          : 'bg-[#f7fafb] text-[#57423f] hover:bg-[#ffdad5]/40 border border-[#dec0bc]/50'
                      }`}
                    >
                      {cat === 'Same Category' ? `Same (${swappingItem.recommendation.category})` : cat}
                    </button>
                  )
                )}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#8b716e] text-base">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search spots, food, activities..."
                  value={swapSearchQuery}
                  onChange={e => setSwapSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#dec0bc] text-xs text-[#181c1d] outline-none bg-white focus:border-[#a4362d]"
                />
              </div>
            </div>

            {/* Alternatives List */}
            {filteredAlternatives.length === 0 ? (
              <div className="p-8 text-center bg-[#f7fafb] rounded-2xl border border-[#dec0bc]">
                <span className="material-symbols-outlined text-3xl text-[#8b716e] mb-2">
                  travel_explore
                </span>
                <p className="text-xs font-semibold text-[#181c1d]">No alternatives found matching filter</p>
                <p className="text-[11px] text-[#57423f] mt-1">
                  Try switching category filter to "All" or clearing your search.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSwapCategoryFilter('All');
                    setSwapSearchQuery('');
                  }}
                  className="mt-3 px-4 py-1.5 rounded-full bg-[#a4362d] text-white text-xs font-semibold"
                >
                  Show All {trip.destination} Experiences
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {filteredAlternatives.map(alt => {
                  const priceDiff = alt.estimated_cost_usd - swappingItem.recommendation.estimated_cost_usd;

                  // Distance from other day items or base hotel
                  const dayItemsExcludingCurrent = items.filter(
                    i => i.day_number === swappingItem.day_number && i.id !== swappingItem.id
                  );
                  const anchorCoord = dayItemsExcludingCurrent[0]?.recommendation.coordinates || baseHotel?.coordinates;
                  const altTransit = getTransitMetrics(alt.coordinates, anchorCoord, 1.5);

                  return (
                    <div
                      key={alt.id}
                      className="p-4 rounded-2xl border border-[#dec0bc] hover:border-[#a4362d] bg-[#f7fafb] hover:bg-[#ffdad5]/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start sm:items-center space-x-3.5 flex-1">
                        <img
                          src={alt.image_url}
                          alt={alt.name}
                          className="w-16 h-16 rounded-xl object-cover ring-1 ring-[#dec0bc] shrink-0"
                        />
                        <div>
                          <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                            <span className="text-[10px] font-bold uppercase text-[#a4362d] bg-[#ffdad5] px-2 py-0.5 rounded">
                              {alt.category}
                            </span>
                            <span className="text-xs font-bold text-[#181c1d]">{alt.name}</span>
                            <span className="text-[10px] text-[#8b716e] font-semibold">
                              • {alt.location_area}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#57423f] line-clamp-2">{alt.description}</p>
                          {alt.alternative_notes && (
                            <div className="inline-flex items-center space-x-1 mt-1 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[10px]">
                              <span>💡</span>
                              <span className="font-medium">{alt.alternative_notes}</span>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[10px] text-[#8b716e]">
                            <span>★ {alt.rating} ({alt.reviews_count})</span>
                            <span>⏱ {alt.estimated_duration_hours}h</span>
                            <span className="inline-flex items-center space-x-1 font-semibold text-[#a4362d] bg-[#ffdad5]/40 px-1.5 py-0.5 rounded">
                              <span className="material-symbols-outlined text-[11px]">near_me</span>
                              <span>{altTransit.formattedDistance} from Day {swappingItem.day_number} base ({altTransit.formattedDuration})</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 shrink-0">
                        <div className="text-left sm:text-right">
                          <span className="text-xs font-bold text-[#181c1d] block">
                            ${alt.estimated_cost_usd}
                          </span>
                          <span
                            className={`text-[10px] font-semibold ${
                              priceDiff > 0
                                ? 'text-[#ba1a1a]'
                                : priceDiff < 0
                                ? 'text-emerald-700'
                                : 'text-[#8b716e]'
                            }`}
                          >
                            {priceDiff > 0
                              ? `+$${priceDiff}`
                              : priceDiff < 0
                              ? `-$${Math.abs(priceDiff)}`
                              : 'Same cost'}
                          </span>
                        </div>

                        <button
                          id={`confirm-swap-to-${alt.id}`}
                          onClick={() => handleExecuteSwap(alt)}
                          className="px-4 py-2 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm transition-all whitespace-nowrap"
                        >
                          Swap to this
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MOVE / RESCHEDULE MODAL WITH DAY EASE ANALYTICS */}
      {movingItemId && itemBeingMoved && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#dec0bc] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setMovingItemId(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#8b716e] hover:bg-[#ffdad5]/40"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <h3 className="font-serif text-xl font-bold text-[#181c1d] mb-1">
              Move Experience
            </h3>
            <p className="text-xs text-[#57423f] mb-4">
              Select which Day & Time Slot to reschedule <strong className="text-[#181c1d]">{itemBeingMoved.recommendation.name}</strong> based on daily proximity ease.
            </p>

            {/* Daily Proximity Ease Overview */}
            <div className="mb-4 space-y-2">
              <span className="text-[11px] uppercase font-bold text-[#8b716e] tracking-wider block">
                Proximity Fit by Day:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {moveDayAnalyses.map(analysis => (
                  <div
                    key={analysis.dayNumber}
                    className={`p-2.5 rounded-xl border text-xs flex flex-col justify-between ${
                      analysis.isBestFit
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 ring-1 ring-emerald-400'
                        : 'bg-[#f7fafb] border-[#dec0bc]/60 text-[#57423f]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">Day {analysis.dayNumber}</span>
                      {analysis.isBestFit && (
                        <span className="text-[9px] font-bold uppercase bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                          Best Fit
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] mt-1 text-[#8b716e]">
                      {analysis.fitLabel} • {analysis.transitToNearest.formattedDistance} from {analysis.nearestStopName}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-[#dec0bc]/40">
              <div>
                <label className="block text-xs font-bold text-[#57423f] uppercase mb-1">Select Day</label>
                <select
                  id="move-day-select"
                  defaultValue={itemBeingMoved.day_number}
                  className="w-full p-2.5 rounded-xl border border-[#dec0bc] text-xs font-semibold text-[#181c1d] outline-none"
                >
                  {daysArray.map(d => (
                    <option key={d} value={d}>Day {d} ({items.filter(i => i.day_number === d).length} activities)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#57423f] uppercase mb-1">Select Time Slot</label>
                <select
                  id="move-slot-select"
                  defaultValue={itemBeingMoved.time_slot}
                  className="w-full p-2.5 rounded-xl border border-[#dec0bc] text-xs font-semibold text-[#181c1d] outline-none"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>

              <button
                id="confirm-move-btn"
                onClick={() => {
                  const day = Number((document.getElementById('move-day-select') as HTMLSelectElement).value);
                  const slot = (document.getElementById('move-slot-select') as HTMLSelectElement).value as TimeSlot;
                  handleMove(day, slot);
                }}
                className="w-full py-2.5 rounded-xl bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm transition-all"
              >
                Confirm Move
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

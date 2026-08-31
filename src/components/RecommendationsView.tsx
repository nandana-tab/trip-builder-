import React, { useState, useMemo } from 'react';
import { useTrip } from '../context/TripContext';
import { RecommendationCategory, TimeSlot, Recommendation } from '../types';
import {
  getTransitMetrics,
  getBaseHotelForTrip,
  analyzeDayEaseForRecommendation
} from '../utils/distanceUtils';

interface RecommendationsViewProps {
  onNavigateToItinerary: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({ onNavigateToItinerary }) => {
  const {
    activeTripId,
    getTripById,
    getRecommendationsForDestination,
    getTripItems,
    selectedItems,
    addSelectedItem,
    removeSelectedItem,
    recommendations
  } = useTrip();

  const trip = activeTripId ? getTripById(activeTripId) : null;
  const destination = trip?.destination || 'Tokyo';
  const allRecs = getRecommendationsForDestination(destination);
  const tripItems = activeTripId ? getTripItems(activeTripId) : [];

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [addingRecModal, setAddingRecModal] = useState<Recommendation | null>(null);
  const [targetDay, setTargetDay] = useState<number>(1);
  const [targetSlot, setTargetSlot] = useState<TimeSlot>('Morning');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const baseHotel = useMemo(() => {
    if (!trip) return undefined;
    return getBaseHotelForTrip(tripItems, recommendations, trip.destination);
  }, [tripItems, recommendations, trip]);

  const categories: (string | RecommendationCategory)[] = [
    'All',
    'Attractions',
    'Restaurants',
    'Hotels',
    'Activities',
    'Nightlife',
    'Shopping'
  ];

  const filteredRecs = allRecs.filter(rec => {
    const matchesCategory = activeCategory === 'All' || rec.category === activeCategory;
    const matchesSearch =
      rec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      rec.location_area.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const tripSelectedRecIds = selectedItems
    .filter(i => i.trip_id === activeTripId)
    .map(i => i.recommendation_id);

  const handleOpenAddModal = (rec: Recommendation) => {
    if (!trip) return;
    const analyses = analyzeDayEaseForRecommendation(rec, trip.duration_days, tripItems, baseHotel);
    const bestFit = analyses.find(a => a.isBestFit) || analyses[0];
    setTargetDay(bestFit ? bestFit.dayNumber : 1);
    setTargetSlot('Morning');
    setAddingRecModal(rec);
  };

  const handleConfirmAdd = () => {
    if (!activeTripId || !addingRecModal) return;
    addSelectedItem(activeTripId, addingRecModal.id, targetDay, targetSlot);
    showToast(`Added ${addingRecModal.name} to Day ${targetDay} (${targetSlot})`);
    setAddingRecModal(null);
  };

  const handleQuickAddBestDay = (rec: Recommendation) => {
    if (!activeTripId || !trip) return;
    const analyses = analyzeDayEaseForRecommendation(rec, trip.duration_days, tripItems, baseHotel);
    const bestFit = analyses.find(a => a.isBestFit) || analyses[0];
    const day = bestFit ? bestFit.dayNumber : 1;
    
    // Pick an empty slot if possible
    const dayItems = tripItems.filter(i => i.day_number === day);
    const usedSlots = dayItems.map(i => i.time_slot);
    let chosenSlot: TimeSlot = 'Morning';
    if (!usedSlots.includes('Morning')) chosenSlot = 'Morning';
    else if (!usedSlots.includes('Afternoon')) chosenSlot = 'Afternoon';
    else if (!usedSlots.includes('Evening')) chosenSlot = 'Evening';
    else chosenSlot = 'Afternoon';

    addSelectedItem(activeTripId, rec.id, day, chosenSlot);
    showToast(`Added ${rec.name} to Day ${day} (${chosenSlot})`);
  };

  const handleRemoveRec = (recId: string) => {
    if (!activeTripId) return;
    const existing = selectedItems.find(i => i.trip_id === activeTripId && i.recommendation_id === recId);
    if (existing) {
      removeSelectedItem(existing.id);
      showToast('Removed from itinerary');
    }
  };

  const selectedCount = tripSelectedRecIds.length;
  const estCost = selectedItems
    .filter(i => i.trip_id === activeTripId)
    .reduce((sum, item) => {
      const rec = allRecs.find(r => r.id === item.recommendation_id);
      return sum + (rec?.estimated_cost_usd || 0);
    }, 0);

  const daysCount = trip?.duration_days || 3;
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#f7fafb] pb-32">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#181c1d] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/20 text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="material-symbols-outlined text-base text-[#ffdad5]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white border-b border-[#dec0bc]/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#ffdad5] text-[#a4362d] text-xs font-bold uppercase tracking-wider mb-2">
                <span className="material-symbols-outlined text-sm">auto_awesome</span>
                <span>AI Matched for your Travel DNA</span>
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#181c1d]">
                Curated for your {destination} Journey
              </h1>
              <p className="text-sm text-[#57423f] mt-1 max-w-2xl">
                Vetted recommendations with <strong className="text-[#181c1d]">geographic proximity calculations</strong>. Add items to specific days based on walking distance and transit ease.
              </p>
              {baseHotel && (
                <div className="mt-2 inline-flex items-center space-x-2 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  <span className="material-symbols-outlined text-sm text-[#a4362d]">hotel</span>
                  <span>Base Stay Anchor: <strong>{baseHotel.name}</strong> ({baseHotel.location_area})</span>
                </div>
              )}
            </div>

            <button
              id="recs-view-itinerary-header-btn"
              onClick={onNavigateToItinerary}
              className="self-start md:self-auto px-6 py-2.5 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm transition-all flex items-center space-x-2"
            >
              <span className="material-symbols-outlined text-base">map</span>
              <span>Open Day-by-Day Canvas ({selectedCount} items)</span>
            </button>
          </div>

          {/* Filter Bar & Search */}
          <div className="mt-8 flex flex-col lg:flex-row items-center justify-between gap-4 pt-4 border-t border-[#dec0bc]/40">
            {/* Category Filter Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
              {categories.map(cat => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    id={`cat-filter-${cat.toLowerCase()}`}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-[#a4362d] text-white shadow-sm'
                        : 'bg-[#f7fafb] text-[#57423f] hover:bg-[#ffdad5]/40 border border-[#dec0bc]/60'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full lg:w-72">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-base text-[#8b716e]">
                search
              </span>
              <input
                id="recs-search-input"
                type="text"
                placeholder="Search spots, food, tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-full border border-[#dec0bc] text-xs text-[#181c1d] outline-none bg-white focus:border-[#a4362d]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredRecs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#dec0bc]/60 max-w-md mx-auto my-12">
            <span className="material-symbols-outlined text-4xl text-[#8b716e] mb-3">
              search_off
            </span>
            <h3 className="font-serif text-xl font-bold text-[#181c1d]">No recommendations found</h3>
            <p className="text-xs text-[#57423f] mt-1">Try selecting "All" or adjusting your search query.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecs.map(rec => {
              const isSelected = tripSelectedRecIds.includes(rec.id);
              const selectedEntry = selectedItems.find(
                i => i.trip_id === activeTripId && i.recommendation_id === rec.id
              );

              // Proximity analysis relative to base hotel and trip days
              const transitFromHotel = getTransitMetrics(
                rec.coordinates,
                baseHotel?.coordinates,
                1.6
              );

              const dayAnalyses = trip
                ? analyzeDayEaseForRecommendation(rec, trip.duration_days, tripItems, baseHotel)
                : [];
              const bestDayAnalysis = dayAnalyses.find(a => a.isBestFit);

              return (
                <div
                  key={rec.id}
                  id={`rec-card-${rec.id}`}
                  className={`bg-white rounded-3xl overflow-hidden border-2 transition-all duration-200 flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#a4362d] shadow-lg ring-2 ring-[#ffdad5]'
                      : 'border-[#dec0bc]/60 shadow-sm hover:border-[#dec0bc] hover:shadow-md'
                  }`}
                >
                  {/* Image & Badges */}
                  <div>
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={rec.image_url}
                        alt={rec.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                        <span className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#181c1d]">
                          {rec.category}
                        </span>
                        {rec.is_top_match && (
                          <span className="bg-[#a4362d] text-white px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center space-x-1 shadow-sm">
                            <span className="material-symbols-outlined text-xs">verified</span>
                            <span>Top Match</span>
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white px-2 py-0.5 rounded-lg text-xs font-semibold flex items-center space-x-1">
                        <span className="material-symbols-outlined text-xs text-amber-400">star</span>
                        <span>{rec.rating}</span>
                        <span className="text-[10px] text-white/70">({rec.reviews_count})</span>
                      </div>

                      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full text-[11px]">
                        {rec.location_area}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-serif text-lg font-bold text-[#181c1d] leading-snug">
                          {rec.name}
                        </h3>
                        <span className="text-xs font-bold text-[#a4362d] bg-[#ffdad5]/50 px-2 py-0.5 rounded">
                          {rec.price_tier} • ${rec.estimated_cost_usd}
                        </span>
                      </div>

                      <p className="text-xs text-[#57423f] mt-2 line-clamp-2 leading-relaxed">
                        {rec.description}
                      </p>

                      {/* Distance from Hotel / Previous Activities Badge */}
                      <div className="mt-3 p-2.5 rounded-xl bg-[#f7fafb] border border-[#dec0bc]/50 space-y-1.5 text-[11px]">
                        <div className="flex items-center justify-between">
                          <span className="text-[#57423f] flex items-center space-x-1">
                            <span className="material-symbols-outlined text-xs text-[#a4362d]">hotel</span>
                            <span>From Hotel Base:</span>
                          </span>
                          <span className="font-semibold text-[#181c1d]">
                            {transitFromHotel.formattedDistance} ({transitFromHotel.formattedDuration} {transitFromHotel.modeLabel})
                          </span>
                        </div>

                        {bestDayAnalysis && (
                          <div className="flex items-center justify-between pt-1 border-t border-[#dec0bc]/30">
                            <span className="text-[#a4362d] font-semibold flex items-center space-x-1">
                              <span className="material-symbols-outlined text-xs">auto_awesome</span>
                              <span>Best Ease Fit:</span>
                            </span>
                            <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded text-[10px]">
                              Day {bestDayAnalysis.dayNumber} ({bestDayAnalysis.fitLabel.split(' ')[0]} {bestDayAnalysis.distanceToNearestKm} km)
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Why Recommended Callout */}
                      <div className="mt-2.5 p-2 rounded-xl bg-[#ffdad5]/20 border border-[#dec0bc]/40 text-[11px] text-[#57423f] flex items-start space-x-2">
                        <span className="material-symbols-outlined text-sm text-[#a4362d] mt-0.5">
                          lightbulb
                        </span>
                        <span className="leading-snug">{rec.why_recommended}</span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {rec.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold text-[#8b716e] bg-[#f7fafb] border border-[#dec0bc]/40 px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-4 bg-[#f7fafb] border-t border-[#dec0bc]/40 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-[#57423f]">
                      Est. duration: <strong className="text-[#181c1d]">{rec.estimated_duration_hours}h</strong>
                    </span>

                    {isSelected ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] font-bold text-[#a4362d] bg-[#ffdad5] px-2.5 py-1 rounded-full">
                          Day {selectedEntry?.day_number} ({selectedEntry?.time_slot})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveRec(rec.id)}
                          className="px-3 py-1 rounded-full text-xs font-semibold text-[#ba1a1a] hover:bg-[#ba1a1a]/10 border border-[#ba1a1a]/30"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <button
                          id={`quick-add-${rec.id}`}
                          type="button"
                          onClick={() => handleQuickAddBestDay(rec)}
                          className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[#ffdad5]/40 hover:bg-[#ffdad5] text-[#a4362d] border border-[#dec0bc] transition-colors"
                          title="Quick add to the day with closest proximity"
                        >
                          Quick Add
                        </button>
                        <button
                          id={`toggle-rec-btn-${rec.id}`}
                          type="button"
                          onClick={() => handleOpenAddModal(rec)}
                          className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#a4362d] hover:bg-[#8b2d25] text-white shadow-xs transition-all flex items-center space-x-1"
                        >
                          <span className="material-symbols-outlined text-sm">add</span>
                          <span>Add to Day</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ADD TO SPECIFIC DAY MODAL */}
      {addingRecModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#dec0bc] relative">
            <button
              onClick={() => setAddingRecModal(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center text-[#8b716e] hover:bg-[#ffdad5]/40"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>

            <h3 className="font-serif text-xl font-bold text-[#181c1d] mb-1">
              Add to Itinerary
            </h3>
            <p className="text-xs text-[#57423f] mb-4">
              Schedule <strong className="text-[#181c1d]">{addingRecModal.name}</strong> onto your journey canvas.
            </p>

            {/* Daily Proximity Ease Suggestions */}
            {trip && (
              <div className="mb-4 space-y-2">
                <span className="text-[11px] uppercase font-bold text-[#8b716e] tracking-wider block">
                  Proximity Analysis by Day:
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {analyzeDayEaseForRecommendation(addingRecModal, trip.duration_days, tripItems, baseHotel).map(
                    analysis => (
                      <div
                        key={analysis.dayNumber}
                        onClick={() => setTargetDay(analysis.dayNumber)}
                        className={`p-2 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                          targetDay === analysis.dayNumber
                            ? 'bg-[#ffdad5]/40 border-[#a4362d] text-[#181c1d] font-semibold'
                            : 'bg-[#f7fafb] border-[#dec0bc]/50 text-[#57423f] hover:bg-[#ffdad5]/20'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <span className="w-5 h-5 rounded-full bg-[#a4362d] text-white text-[10px] font-bold flex items-center justify-center">
                            D{analysis.dayNumber}
                          </span>
                          <span>{analysis.fitLabel}</span>
                        </div>
                        <span className="text-[10px] text-[#8b716e]">
                          {analysis.transitToNearest.formattedDistance}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="space-y-4 pt-2 border-t border-[#dec0bc]/40">
              <div>
                <label className="block text-xs font-bold text-[#57423f] uppercase mb-1">Select Day</label>
                <select
                  id="add-day-select"
                  value={targetDay}
                  onChange={e => setTargetDay(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-[#dec0bc] text-xs font-semibold text-[#181c1d] outline-none"
                >
                  {daysArray.map(d => (
                    <option key={d} value={d}>Day {d} ({tripItems.filter(i => i.day_number === d).length} spots planned)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#57423f] uppercase mb-1">Select Time Slot</label>
                <select
                  id="add-slot-select"
                  value={targetSlot}
                  onChange={e => setTargetSlot(e.target.value as TimeSlot)}
                  className="w-full p-2.5 rounded-xl border border-[#dec0bc] text-xs font-semibold text-[#181c1d] outline-none"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Evening">Evening</option>
                </select>
              </div>

              <button
                id="confirm-add-rec-btn"
                onClick={handleConfirmAdd}
                className="w-full py-2.5 rounded-xl bg-[#a4362d] hover:bg-[#8b2d25] text-white text-xs font-semibold shadow-sm transition-all"
              >
                Add Experience to Day {targetDay}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Running Selection Tray */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#dec0bc] py-4 px-4 sm:px-8 z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-2xl bg-[#ffdad5] text-[#a4362d] flex items-center justify-center font-bold">
              {selectedCount}
            </div>
            <div>
              <p className="text-xs text-[#8b716e] uppercase font-semibold">Active Selection</p>
              <p className="text-sm font-bold text-[#181c1d]">
                {selectedCount} experiences selected • Approx. ${estCost.toLocaleString()} est.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              id="recs-bottom-itinerary-btn"
              onClick={onNavigateToItinerary}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#a4362d] hover:bg-[#8b2d25] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>Build Day-by-Day Schedule</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

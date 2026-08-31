import { Recommendation, SelectedItem } from '../types';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface TransitInfo {
  distanceKm: number;
  distanceMiles: number;
  formattedDistance: string;
  durationMinutes: number;
  formattedDuration: string;
  mode: 'walk' | 'transit' | 'drive';
  modeLabel: string;
  modeIcon: string;
  easeLevel: 'Very Easy' | 'Easy' | 'Moderate' | 'Cross-Town' | 'Excursion';
  easeBadgeClass: string;
  easeBadgeBorder: string;
}

/**
 * Calculate Haversine distance between two latitude/longitude points in kilometers.
 */
export function calculateDistanceKm(
  coord1?: Coordinates,
  coord2?: Coordinates
): number {
  if (!coord1 || !coord2) return 0;

  const R = 6371; // Earth's radius in kilometers
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coord1.lat * Math.PI) / 180) *
      Math.cos((coord2.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return Math.round(d * 10) / 10; // 1 decimal place
}

/**
 * Computes human-friendly transit and proximity metrics between two coordinates.
 */
export function getTransitMetrics(
  from?: Coordinates,
  to?: Coordinates,
  fallbackKm: number = 1.8
): TransitInfo {
  let distKm = calculateDistanceKm(from, to);

  // If no coordinates are defined or they are identical, use a realistic fallback if provided
  if (distKm === 0 && (!from || !to)) {
    distKm = fallbackKm;
  }

  const distMiles = Math.round(distKm * 0.621371 * 10) / 10;

  let mode: 'walk' | 'transit' | 'drive' = 'walk';
  let modeLabel = 'Walk';
  let modeIcon = 'directions_walk';
  let durationMins = 0;
  let easeLevel: TransitInfo['easeLevel'] = 'Very Easy';
  let easeBadgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let easeBadgeBorder = 'border-emerald-300';

  if (distKm <= 0.4) {
    mode = 'walk';
    modeLabel = 'Immediate Walk';
    modeIcon = 'directions_walk';
    durationMins = Math.max(2, Math.round((distKm / 4.2) * 60));
    easeLevel = 'Very Easy';
    easeBadgeClass = 'bg-emerald-50 text-emerald-800 border-emerald-200';
    easeBadgeBorder = 'border-emerald-300';
  } else if (distKm <= 1.4) {
    mode = 'walk';
    modeLabel = 'Pleasant Walk';
    modeIcon = 'directions_walk';
    durationMins = Math.round((distKm / 4.5) * 60);
    easeLevel = 'Very Easy';
    easeBadgeClass = 'bg-teal-50 text-teal-800 border-teal-200';
    easeBadgeBorder = 'border-teal-300';
  } else if (distKm <= 4.0) {
    mode = 'transit';
    modeLabel = 'Short Metro / Taxi';
    modeIcon = 'local_taxi';
    durationMins = Math.round(6 + (distKm / 24) * 60);
    easeLevel = 'Easy';
    easeBadgeClass = 'bg-blue-50 text-blue-800 border-blue-200';
    easeBadgeBorder = 'border-blue-300';
  } else if (distKm <= 9.0) {
    mode = 'transit';
    modeLabel = 'City Transit';
    modeIcon = 'directions_subway';
    durationMins = Math.round(10 + (distKm / 28) * 60);
    easeLevel = 'Moderate';
    easeBadgeClass = 'bg-amber-50 text-amber-800 border-amber-200';
    easeBadgeBorder = 'border-amber-300';
  } else {
    mode = 'drive';
    modeLabel = 'Scenic Drive / Transfer';
    modeIcon = 'directions_car';
    durationMins = Math.round(15 + (distKm / 45) * 60);
    easeLevel = 'Cross-Town';
    easeBadgeClass = 'bg-purple-50 text-purple-800 border-purple-200';
    easeBadgeBorder = 'border-purple-300';
  }

  const formattedDistance =
    distKm < 1 ? `${Math.round(distKm * 1000)} m` : `${distKm} km (${distMiles} mi)`;
  const formattedDuration = `${durationMins} min`;

  return {
    distanceKm: distKm,
    distanceMiles: distMiles,
    formattedDistance,
    durationMinutes: durationMins,
    formattedDuration,
    mode,
    modeLabel,
    modeIcon,
    easeLevel,
    easeBadgeClass,
    easeBadgeBorder
  };
}

/**
 * Finds the primary hotel/accommodation for the trip to serve as the daily origin base.
 */
export function getBaseHotelForTrip(
  tripItems: (SelectedItem & { recommendation: Recommendation })[],
  allRecommendations: Recommendation[],
  destinationName: string,
  budgetTier?: string
): Recommendation | undefined {
  // 1. Look for selected hotel in trip items
  const selectedHotel = tripItems.find(
    item => item.recommendation?.category === 'Hotels'
  )?.recommendation;

  if (selectedHotel) return selectedHotel;

  // 2. Look for matching hotel in destination
  const destClean = destinationName.toLowerCase().trim();
  const destHotels = allRecommendations.filter(
    r =>
      r.category === 'Hotels' &&
      (r.destination.toLowerCase().includes(destClean) ||
        destClean.includes(r.destination.toLowerCase()))
  );

  if (destHotels.length === 0) return undefined;

  // If budget tier is budget/essential, select budget hotel ($ or $$)
  if (budgetTier === 'budget') {
    const budgetHotel = destHotels.find(h => h.price_tier === '$' || h.price_tier === '$$');
    if (budgetHotel) return budgetHotel;
  } else if (budgetTier === 'luxury') {
    const luxHotel = destHotels.find(h => h.price_tier === '$$$$');
    if (luxHotel) return luxHotel;
  }

  return destHotels.find(h => h.is_top_match) || destHotels[0];
}

export interface DayEaseAnalysis {
  dayNumber: number;
  itemsCount: number;
  nearestStopName: string;
  distanceToNearestKm: number;
  transitToNearest: TransitInfo;
  distanceFromHotelKm: number;
  transitFromHotel: TransitInfo;
  isBestFit: boolean;
  easeScore: number; // 0 (far) to 100 (adjacent/super easy)
  fitLabel: string;
}

/**
 * Analyzes how easily a given recommendation fits into each day of a trip based on proximity.
 */
export function analyzeDayEaseForRecommendation(
  targetRec: Recommendation,
  daysCount: number,
  tripItems: (SelectedItem & { recommendation: Recommendation })[],
  baseHotel?: Recommendation
): DayEaseAnalysis[] {
  const analyses: DayEaseAnalysis[] = [];

  for (let day = 1; day <= daysCount; day++) {
    const dayItems = tripItems.filter(i => i.day_number === day);
    let minDistanceKm = 999;
    let nearestName = 'Day Start';

    if (dayItems.length > 0) {
      for (const item of dayItems) {
        const d = calculateDistanceKm(
          targetRec.coordinates,
          item.recommendation.coordinates
        );
        if (d < minDistanceKm) {
          minDistanceKm = d;
          nearestName = item.recommendation.name;
        }
      }
    } else if (baseHotel?.coordinates && targetRec.coordinates) {
      minDistanceKm = calculateDistanceKm(
        targetRec.coordinates,
        baseHotel.coordinates
      );
      nearestName = `Hotel: ${baseHotel.name}`;
    } else {
      minDistanceKm = 2.0; // neutral fallback
      nearestName = 'Hotel Base';
    }

    const distFromHotelKm =
      baseHotel?.coordinates && targetRec.coordinates
        ? calculateDistanceKm(targetRec.coordinates, baseHotel.coordinates)
        : minDistanceKm;

    const transitNearest = getTransitMetrics(
      targetRec.coordinates,
      dayItems[0]?.recommendation?.coordinates || baseHotel?.coordinates,
      minDistanceKm
    );

    const transitHotel = getTransitMetrics(
      targetRec.coordinates,
      baseHotel?.coordinates,
      distFromHotelKm
    );

    // Calculate ease score (0-100)
    // Distance < 1.0 km -> 90-100
    // Distance < 3.0 km -> 70-89
    // Distance < 6.0 km -> 50-69
    // Distance < 12.0 km -> 30-49
    let easeScore = Math.max(10, Math.round(100 - minDistanceKm * 8));
    if (dayItems.length >= 4) {
      easeScore = Math.max(15, easeScore - 20); // penalty for already packed day
    }

    let fitLabel = 'Good fit';
    if (minDistanceKm <= 1.0) {
      fitLabel = '⚡ Ideal proximity (<1 km)';
    } else if (minDistanceKm <= 2.8) {
      fitLabel = '🚶 Walkable / Short ride';
    } else if (minDistanceKm <= 6.0) {
      fitLabel = '🚖 Moderate transit';
    } else {
      fitLabel = '🚇 Separate district';
    }

    analyses.push({
      dayNumber: day,
      itemsCount: dayItems.length,
      nearestStopName: nearestName,
      distanceToNearestKm: minDistanceKm,
      transitToNearest: transitNearest,
      distanceFromHotelKm: distFromHotelKm,
      transitFromHotel: transitHotel,
      isBestFit: false,
      easeScore,
      fitLabel
    });
  }

  // Mark best fit
  if (analyses.length > 0) {
    const highestScore = Math.max(...analyses.map(a => a.easeScore));
    const best = analyses.find(a => a.easeScore === highestScore);
    if (best) {
      best.isBestFit = true;
    }
  }

  return analyses;
}

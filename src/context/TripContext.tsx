import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Trip,
  Recommendation,
  SelectedItem,
  BudgetBreakdown,
  TimeSlot,
  FineTunePreferences,
  TravelGroup
} from '../types';
import {
  SEED_RECOMMENDATIONS,
  SAMPLE_INITIAL_TRIP,
  SAMPLE_INITIAL_ITEMS,
  POPULAR_DESTINATIONS
} from '../data/seedData';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

export interface WizardDraft {
  destination: string;
  destination_country: string;
  destination_image: string;
  start_date: string;
  end_date: string;
  duration_days: number;
  travel_group: TravelGroup;
  budget_tier: 'budget' | 'mid-range' | 'premium' | 'luxury';
  total_budget_usd: number;
  travel_dna: string[];
  priority_tags: string[];
  fine_tune: FineTunePreferences;
}

interface TripContextType {
  trips: Trip[];
  recommendations: Recommendation[];
  selectedItems: SelectedItem[];
  activeTripId: string | null;
  setActiveTripId: (id: string | null) => void;
  wizardDraft: WizardDraft;
  updateWizardDraft: (partial: Partial<WizardDraft>) => void;
  resetWizardDraft: () => void;
  createTripFromDraft: () => string;
  getTripById: (id: string) => Trip | undefined;
  getTripItems: (tripId: string) => (SelectedItem & { recommendation: Recommendation })[];
  getRecommendationsForDestination: (destination: string) => Recommendation[];
  addSelectedItem: (tripId: string, recId: string, day?: number, slot?: TimeSlot) => void;
  removeSelectedItem: (itemId: string) => void;
  swapSelectedItem: (itemId: string, newRecId: string) => void;
  moveSelectedItem: (itemId: string, newDay: number, newSlot: TimeSlot) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
  calculateBudgetBreakdown: (tripId: string) => BudgetBreakdown;
  getAlternativeRecommendations: (recId: string) => Recommendation[];
  quickPlanPreset: (destName: string, days?: number) => string;
}

const DEFAULT_WIZARD_DRAFT: WizardDraft = {
  destination: 'Tokyo',
  destination_country: 'Japan',
  destination_image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  start_date: '2026-10-12',
  end_date: '2026-10-18',
  duration_days: 7,
  travel_group: { type: 'Couple', size: 2, label: '2 Travelers' },
  budget_tier: 'premium',
  total_budget_usd: 3500,
  travel_dna: ['culinary', 'culture_history'],
  priority_tags: ['Local Cuisine & Fine Dining', 'Art, Architecture & History'],
  fine_tune: {
    accommodations: 4,
    dining: 5,
    activities: 4,
    pace: 'Moderate'
  }
};

const TripContext = createContext<TripContextType | undefined>(undefined);

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [trips, setTrips] = useState<Trip[]>(() => {
    try {
      const stored = localStorage.getItem('tripbuilder_trips');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse trips', e);
    }
    return [SAMPLE_INITIAL_TRIP];
  });

  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>(() => {
    try {
      const stored = localStorage.getItem('tripbuilder_selected_items');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to parse selected items', e);
    }
    return SAMPLE_INITIAL_ITEMS;
  });

  const [recommendations] = useState<Recommendation[]>(SEED_RECOMMENDATIONS);
  const [activeTripId, setActiveTripId] = useState<string | null>(SAMPLE_INITIAL_TRIP.id);
  const [wizardDraft, setWizardDraft] = useState<WizardDraft>(DEFAULT_WIZARD_DRAFT);

  // Sync with Firestore when user logs in
  useEffect(() => {
    if (!user?.uid) return;

    try {
      const tripsRef = collection(db, 'trips');
      const q = query(tripsRef, where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const remoteTrips: Trip[] = [];
          snapshot.forEach((docSnap) => {
            remoteTrips.push(docSnap.data() as Trip);
          });
          setTrips(prev => {
            // merge remote with existing local
            const map = new Map<string, Trip>();
            prev.forEach(t => map.set(t.id, t));
            remoteTrips.forEach(t => map.set(t.id, t));
            return Array.from(map.values());
          });
        }
      }, (err) => {
        console.warn('Firestore snapshot listener info:', err);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn('Firestore sync note:', e);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('tripbuilder_trips', JSON.stringify(trips));
  }, [trips]);

  useEffect(() => {
    localStorage.setItem('tripbuilder_selected_items', JSON.stringify(selectedItems));
  }, [selectedItems]);

  const updateWizardDraft = (partial: Partial<WizardDraft>) => {
    setWizardDraft(prev => ({ ...prev, ...partial }));
  };

  const resetWizardDraft = () => {
    setWizardDraft(DEFAULT_WIZARD_DRAFT);
  };

  const getTripById = (id: string) => {
    return trips.find(t => t.id === id);
  };

  const getTripItems = (tripId: string) => {
    const items = selectedItems.filter(item => item.trip_id === tripId);
    return items
      .map(item => {
        const rec = recommendations.find(r => r.id === item.recommendation_id) || {
          id: item.recommendation_id,
          destination: 'Unknown',
          name: 'Custom Activity',
          category: 'Activities' as const,
          rating: 4.8,
          reviews_count: 100,
          price_tier: '$$' as const,
          estimated_cost_usd: 50,
          estimated_duration_hours: 2,
          description: 'Personalized excursion',
          why_recommended: 'Tailored for your itinerary',
          tags: ['Custom'],
          image_url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80',
          location_area: 'Central'
        };
        return { ...item, recommendation: rec };
      })
      .sort((a, b) => {
        if (a.day_number !== b.day_number) return a.day_number - b.day_number;
        const slotOrder = { Morning: 0, Afternoon: 1, Evening: 2 };
        if (slotOrder[a.time_slot] !== slotOrder[b.time_slot]) {
          return slotOrder[a.time_slot] - slotOrder[b.time_slot];
        }
        return a.order_index - b.order_index;
      });
  };

  const getRecommendationsForDestination = (destination: string) => {
    const cleanDest = destination.trim().toLowerCase();
    
    // Synonym and alias matching map
    const aliasMap: Record<string, string[]> = {
      'india': ['india', 'jaipur', 'rajasthan', 'agra', 'delhi'],
      'united states': ['united states', 'usa', 'us', 'new york', 'nyc', 'america', 'manhattan'],
      'china': ['china', 'beijing', 'shanghai'],
      'united kingdom': ['united kingdom', 'uk', 'london', 'great britain', 'britain', 'england'],
      'scottish highlands': ['scotland', 'highlands', 'scottish highlands', 'edinburgh', 'inverness'],
      'tokyo': ['tokyo', 'japan'],
      'kyoto': ['kyoto', 'japan'],
      'amalfi coast': ['amalfi', 'amalfi coast', 'positano', 'ravello', 'italy'],
      'rome': ['rome', 'roma', 'italy', 'vatican'],
      'lisbon': ['lisbon', 'lisboa', 'portugal'],
      'bali': ['bali', 'ubud', 'indonesia', 'seminyak', 'canggu'],
      'paris': ['paris', 'france']
    };

    let targetDestKeys: string[] = [];
    for (const [key, aliases] of Object.entries(aliasMap)) {
      if (aliases.some(a => cleanDest.includes(a) || a.includes(cleanDest))) {
        targetDestKeys.push(key.toLowerCase());
      }
    }

    const matches = recommendations.filter(r => {
      const rDest = r.destination.toLowerCase();
      if (rDest.includes(cleanDest) || cleanDest.includes(rDest)) return true;
      if (targetDestKeys.some(k => rDest.includes(k) || k.includes(rDest))) return true;
      return false;
    });

    if (matches.length > 0) return matches;
    return recommendations;
  };

  const getAlternativeRecommendations = (recId: string) => {
    const currentRec = recommendations.find(r => r.id === recId);
    if (!currentRec) return [];

    const cleanDest = (currentRec.destination || '').toLowerCase().trim();
    
    // Find all items belonging to the same destination
    const sameDest = recommendations.filter(
      r =>
        r.id !== recId &&
        (cleanDest === '' ||
          r.destination.toLowerCase().includes(cleanDest) ||
          cleanDest.includes(r.destination.toLowerCase()))
    );

    // 1. Direct explicit paired alternative (if marked in alternative_to_id)
    const explicitAlts = recommendations.filter(
      r =>
        r.id !== recId &&
        ((currentRec.alternative_to_id && r.id === currentRec.alternative_to_id) ||
         (r.alternative_to_id && r.alternative_to_id === currentRec.id))
    );

    // 2. Exact same category in the same destination
    const exactCategorySameDest = sameDest.filter(
      r => r.category === currentRec.category && !explicitAlts.some(ea => ea.id === r.id)
    );

    // 3. Related categories in the same destination (e.g. Attractions & Activities, Restaurants & Nightlife)
    const relatedCategoriesMap: Record<string, string[]> = {
      Attractions: ['Activities', 'Shopping'],
      Activities: ['Attractions', 'Nightlife', 'Shopping'],
      Restaurants: ['Nightlife', 'Activities'],
      Nightlife: ['Restaurants', 'Activities'],
      Hotels: ['Activities', 'Attractions'],
      Shopping: ['Attractions', 'Activities']
    };
    const relatedCats = relatedCategoriesMap[currentRec.category] || [];
    const relatedCategorySameDest = sameDest.filter(
      r =>
        relatedCats.includes(r.category) &&
        r.category !== currentRec.category &&
        !explicitAlts.some(ea => ea.id === r.id)
    );

    // 4. Other experiences in the same destination
    const otherSameDest = sameDest.filter(
      r =>
        r.category !== currentRec.category &&
        !relatedCats.includes(r.category) &&
        !explicitAlts.some(ea => ea.id === r.id)
    );

    // Ordered combination
    const combined = [
      ...explicitAlts,
      ...exactCategorySameDest,
      ...relatedCategorySameDest,
      ...otherSameDest
    ];

    const uniqueMap = new Map<string, Recommendation>();
    for (const item of combined) {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    }

    // 5. If destination has very few items, supplement with top-rated items in the same category
    if (uniqueMap.size < 4) {
      const globalCategoryMatches = recommendations.filter(
        r => r.id !== recId && r.category === currentRec.category && !uniqueMap.has(r.id)
      );
      for (const item of globalCategoryMatches) {
        uniqueMap.set(item.id, item);
        if (uniqueMap.size >= 8) break;
      }
    }

    const currentTrip = trips.find(t => t.id === activeTripId);
    const isBudgetTrip = currentTrip?.budget_tier === 'budget';

    let result = Array.from(uniqueMap.values());
    if (isBudgetTrip) {
      result = result.sort((a, b) => {
        const pOrder: Record<string, number> = { '$': 1, '$$': 2, '$$$': 3, '$$$$': 4 };
        return (pOrder[a.price_tier] || 2) - (pOrder[b.price_tier] || 2);
      });
    }

    return result;
  };

  const createTripFromDraft = (): string => {
    const newId = `trip-${Date.now()}`;
    const newTrip: Trip = {
      id: newId,
      user_id: user?.uid || 'guest-traveler',
      title: `${wizardDraft.destination} Odyssey`,
      destination: wizardDraft.destination,
      destination_country: wizardDraft.destination_country,
      destination_image: wizardDraft.destination_image,
      start_date: wizardDraft.start_date,
      end_date: wizardDraft.end_date,
      duration_days: wizardDraft.duration_days,
      travel_group: wizardDraft.travel_group,
      budget_tier: wizardDraft.budget_tier,
      total_budget_usd: wizardDraft.total_budget_usd,
      travel_dna: wizardDraft.travel_dna,
      priority_tags: wizardDraft.priority_tags,
      fine_tune: wizardDraft.fine_tune,
      status: 'curated',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Auto-curate initial recommendations matching destination and budget preferences
    const availableRecs = getRecommendationsForDestination(wizardDraft.destination);

    const isBudgetStay = wizardDraft.budget_tier === 'budget' || wizardDraft.fine_tune.accommodations <= 2;
    const isMidStay = wizardDraft.budget_tier === 'mid-range' || wizardDraft.fine_tune.accommodations === 3;
    const isLuxuryStay = wizardDraft.budget_tier === 'luxury' || wizardDraft.fine_tune.accommodations === 5;

    const isDiningBudget = wizardDraft.budget_tier === 'budget' || wizardDraft.fine_tune.dining <= 2;
    const isDiningMid = wizardDraft.budget_tier === 'mid-range' || wizardDraft.fine_tune.dining === 3;
    const isDiningLuxury = wizardDraft.budget_tier === 'luxury' || wizardDraft.fine_tune.dining === 5;

    // Filter and score candidate hotels
    const hotelCandidates = availableRecs
      .filter(r => r.category === 'Hotels')
      .sort((a, b) => {
        const score = (h: Recommendation) => {
          let s = (h.rating || 4.5) * 10;
          if (isBudgetStay) {
            if (h.price_tier === '$') s += 140;
            else if (h.price_tier === '$$') s += 90;
            else if (h.price_tier === '$$$') s -= 80;
            else if (h.price_tier === '$$$$') s -= 300;
          } else if (isMidStay) {
            if (h.price_tier === '$$') s += 100;
            else if (h.price_tier === '$$$') s += 80;
            else if (h.price_tier === '$') s += 60;
            else if (h.price_tier === '$$$$') s -= 60;
          } else if (isLuxuryStay) {
            if (h.price_tier === '$$$$') s += 120;
            else if (h.price_tier === '$$$') s += 60;
            else s -= 120;
          } else {
            if (h.price_tier === '$$$$' || h.price_tier === '$$$') s += 100;
            else if (h.price_tier === '$$') s += 50;
            else s -= 40;
          }
          return s;
        };
        return score(b) - score(a);
      });

    // Filter and score candidate restaurants
    const restaurantCandidates = availableRecs
      .filter(r => r.category === 'Restaurants')
      .sort((a, b) => {
        const score = (r: Recommendation) => {
          let s = (r.rating || 4.5) * 10;
          if (isDiningBudget) {
            if (r.price_tier === '$') s += 140;
            else if (r.price_tier === '$$') s += 90;
            else if (r.price_tier === '$$$') s -= 80;
            else if (r.price_tier === '$$$$') s -= 300;
          } else if (isDiningMid) {
            if (r.price_tier === '$$') s += 100;
            else if (r.price_tier === '$$$') s += 75;
            else if (r.price_tier === '$') s += 65;
            else if (r.price_tier === '$$$$') s -= 50;
          } else if (isDiningLuxury) {
            if (r.price_tier === '$$$$') s += 120;
            else if (r.price_tier === '$$$') s += 70;
            else s -= 80;
          } else {
            if (r.price_tier === '$$$$' || r.price_tier === '$$$') s += 95;
            else if (r.price_tier === '$$') s += 45;
            else s -= 20;
          }
          return s;
        };
        return score(b) - score(a);
      });

    // Score other activities & attractions
    const activityCandidates = availableRecs
      .filter(r => r.category !== 'Hotels' && r.category !== 'Restaurants')
      .sort((a, b) => {
        let sA = (a.rating || 4.5) * 10 + (a.is_top_match ? 25 : 0);
        let sB = (b.rating || 4.5) * 10 + (b.is_top_match ? 25 : 0);
        if (isBudgetStay) {
          if (a.price_tier === '$') sA += 40;
          else if (a.price_tier === '$$') sA += 20;
          else if (a.price_tier === '$$$$') sA -= 60;
          if (b.price_tier === '$') sB += 40;
          else if (b.price_tier === '$$') sB += 20;
          else if (b.price_tier === '$$$$') sB -= 60;
        }
        return sB - sA;
      });

    const newSelectedItems: SelectedItem[] = [];
    const usedRecIds = new Set<string>();

    // 1. Pick primary base hotel
    const primaryHotel = hotelCandidates[0];
    if (primaryHotel) {
      usedRecIds.add(primaryHotel.id);
      newSelectedItems.push({
        id: `sel-${Date.now()}-hotel`,
        trip_id: newId,
        recommendation_id: primaryHotel.id,
        day_number: 1,
        time_slot: 'Evening',
        order_index: 2
      });
    }

    let restIdx = 0;
    let actIdx = 0;

    for (let day = 1; day <= wizardDraft.duration_days; day++) {
      // Morning Slot: Sight / Attraction / Cultural sight
      const morningAct = activityCandidates.find(a => !usedRecIds.has(a.id)) || activityCandidates[actIdx % Math.max(1, activityCandidates.length)];
      if (morningAct) {
        usedRecIds.add(morningAct.id);
        actIdx++;
        newSelectedItems.push({
          id: `sel-${Date.now()}-d${day}-m`,
          trip_id: newId,
          recommendation_id: morningAct.id,
          day_number: day,
          time_slot: 'Morning',
          order_index: 0
        });
      }

      // Afternoon Slot: Activity / Hidden Gem / Neighborhood Walk
      const afternoonAct = activityCandidates.find(a => !usedRecIds.has(a.id)) || activityCandidates[actIdx % Math.max(1, activityCandidates.length)];
      if (afternoonAct) {
        usedRecIds.add(afternoonAct.id);
        actIdx++;
        newSelectedItems.push({
          id: `sel-${Date.now()}-d${day}-a`,
          trip_id: newId,
          recommendation_id: afternoonAct.id,
          day_number: day,
          time_slot: 'Afternoon',
          order_index: 1
        });
      }

      // Evening Slot (for days after Day 1, or if no primary hotel on Day 1)
      if (day > 1 || !primaryHotel) {
        const eveningRest = restaurantCandidates.find(r => !usedRecIds.has(r.id)) || restaurantCandidates[restIdx % Math.max(1, restaurantCandidates.length)];
        if (eveningRest) {
          usedRecIds.add(eveningRest.id);
          restIdx++;
          newSelectedItems.push({
            id: `sel-${Date.now()}-d${day}-e`,
            trip_id: newId,
            recommendation_id: eveningRest.id,
            day_number: day,
            time_slot: 'Evening',
            order_index: 2
          });
        }
      }
    }

    setTrips(prev => [newTrip, ...prev]);
    setSelectedItems(prev => [...prev, ...newSelectedItems]);
    setActiveTripId(newId);

    // Save to Firestore if authenticated
    if (user?.uid) {
      setDoc(doc(db, 'trips', newId), {
        ...newTrip,
        userId: user.uid
      }).catch(err => console.warn('Firestore trip save error:', err));
    }

    return newId;
  };

  const quickPlanPreset = (destName: string, days: number = 7): string => {
    const destInfo = POPULAR_DESTINATIONS.find(d => d.name.toLowerCase() === destName.toLowerCase()) || POPULAR_DESTINATIONS[0];
    const today = new Date();
    const nextMonth = new Date(today);
    nextMonth.setDate(today.getDate() + 45);
    const end = new Date(nextMonth);
    end.setDate(nextMonth.getDate() + (days - 1));

    const draft: WizardDraft = {
      destination: destInfo.name,
      destination_country: destInfo.country,
      destination_image: destInfo.image,
      start_date: nextMonth.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
      duration_days: days,
      travel_group: { type: 'Couple', size: 2, label: '2 Travelers' },
      budget_tier: 'premium',
      total_budget_usd: destInfo.avgDailyBudget * days * 2,
      travel_dna: ['culinary', 'culture_history', 'nature_scenery'],
      priority_tags: ['Local Cuisine & Fine Dining', 'Art, Architecture & History'],
      fine_tune: {
        accommodations: 4,
        dining: 5,
        activities: 4,
        pace: 'Moderate'
      }
    };
    setWizardDraft(draft);
    const newId = `trip-${Date.now()}`;
    const newTrip: Trip = {
      id: newId,
      user_id: user?.uid || 'guest-traveler',
      title: `${destInfo.name}: Curated ${days}-Day Journey`,
      destination: destInfo.name,
      destination_country: destInfo.country,
      destination_image: destInfo.image,
      start_date: draft.start_date,
      end_date: draft.end_date,
      duration_days: days,
      travel_group: draft.travel_group,
      budget_tier: draft.budget_tier,
      total_budget_usd: draft.total_budget_usd,
      travel_dna: draft.travel_dna,
      priority_tags: draft.priority_tags,
      fine_tune: draft.fine_tune,
      status: 'finalized',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const destRecs = getRecommendationsForDestination(destInfo.name);
    const newItems: SelectedItem[] = destRecs.slice(0, Math.min(10, days * 2)).map((rec, i) => ({
      id: `sel-${Date.now()}-${i}`,
      trip_id: newId,
      recommendation_id: rec.id,
      day_number: (i % days) + 1,
      time_slot: (['Morning', 'Afternoon', 'Evening'] as TimeSlot[])[i % 3],
      order_index: i
    }));

    setTrips(prev => [newTrip, ...prev]);
    setSelectedItems(prev => [...prev, ...newItems]);
    setActiveTripId(newId);

    // Save to Firestore if authenticated
    if (user?.uid) {
      setDoc(doc(db, 'trips', newId), {
        ...newTrip,
        userId: user.uid
      }).catch(err => console.warn('Firestore trip save error:', err));
    }

    return newId;
  };

  const addSelectedItem = (tripId: string, recId: string, day: number = 1, slot: TimeSlot = 'Morning') => {
    const existing = selectedItems.find(i => i.trip_id === tripId && i.recommendation_id === recId);
    if (existing) return;

    const newItem: SelectedItem = {
      id: `sel-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      trip_id: tripId,
      recommendation_id: recId,
      day_number: day,
      time_slot: slot,
      order_index: selectedItems.filter(i => i.trip_id === tripId && i.day_number === day).length
    };
    setSelectedItems(prev => [...prev, newItem]);
  };

  const removeSelectedItem = (itemId: string) => {
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const swapSelectedItem = (itemId: string, newRecId: string) => {
    setSelectedItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, recommendation_id: newRecId } : item))
    );
  };

  const moveSelectedItem = (itemId: string, newDay: number, newSlot: TimeSlot) => {
    setSelectedItems(prev =>
      prev.map(item => (item.id === itemId ? { ...item, day_number: newDay, time_slot: newSlot } : item))
    );
  };

  const updateTrip = (id: string, updates: Partial<Trip>) => {
    setTrips(prev =>
      prev.map(trip => {
        if (trip.id === id) {
          const updated = { ...trip, ...updates, updated_at: new Date().toISOString() };
          if (user?.uid) {
            setDoc(doc(db, 'trips', id), { ...updated, userId: user.uid }, { merge: true })
              .catch(err => console.warn('Firestore update error:', err));
          }
          return updated;
        }
        return trip;
      })
    );
  };

  const deleteTrip = (id: string) => {
    setTrips(prev => prev.filter(t => t.id !== id));
    setSelectedItems(prev => prev.filter(i => i.trip_id !== id));
    if (activeTripId === id) {
      const remaining = trips.filter(t => t.id !== id);
      setActiveTripId(remaining.length > 0 ? remaining[0].id : null);
    }
    if (user?.uid) {
      deleteDoc(doc(db, 'trips', id)).catch(err => console.warn('Firestore delete error:', err));
    }
  };

  const calculateBudgetBreakdown = (tripId: string): BudgetBreakdown => {
    const trip = getTripById(tripId);
    const items = getTripItems(tripId);

    let accommodations = 0;
    let dining = 0;
    let activities = 0;
    let transport_other = 0;

    items.forEach(item => {
      const cost = item.recommendation.estimated_cost_usd || 0;
      switch (item.recommendation.category) {
        case 'Hotels':
          accommodations += cost;
          break;
        case 'Restaurants':
          dining += cost;
          break;
        case 'Attractions':
        case 'Activities':
          activities += cost;
          break;
        default:
          transport_other += cost;
          break;
      }
    });

    // If no hotel item selected, calculate standard per-night accommodation estimate based on tier & duration
    if (accommodations === 0 && trip) {
      const perNight = trip.budget_tier === 'luxury' ? 650 : trip.budget_tier === 'premium' ? 320 : trip.budget_tier === 'mid-range' ? 170 : 85;
      accommodations = perNight * Math.max(1, trip.duration_days - 1);
    }

    const total_estimated = accommodations + dining + activities + transport_other;
    const budget_goal = trip?.total_budget_usd || 3000;
    const difference = budget_goal - total_estimated;

    return {
      accommodations,
      dining,
      activities,
      transport_other,
      total_estimated,
      budget_goal,
      difference
    };
  };

  return (
    <TripContext.Provider
      value={{
        trips,
        recommendations,
        selectedItems,
        activeTripId,
        setActiveTripId,
        wizardDraft,
        updateWizardDraft,
        resetWizardDraft,
        createTripFromDraft,
        getTripById,
        getTripItems,
        getRecommendationsForDestination,
        addSelectedItem,
        removeSelectedItem,
        swapSelectedItem,
        moveSelectedItem,
        updateTrip,
        deleteTrip,
        calculateBudgetBreakdown,
        getAlternativeRecommendations,
        quickPlanPreset
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};

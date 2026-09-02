export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: string;
}

export type TravelGroupType = 'Solo' | 'Couple' | 'Family' | 'Friends';
export type BudgetTier = 'budget' | 'mid-range' | 'premium' | 'luxury';
export type ItineraryPace = 'Relaxed' | 'Moderate' | 'Packed';

export interface TravelGroup {
  type: TravelGroupType;
  size: number;
  label?: string;
}

export interface FineTunePreferences {
  accommodations: number; // 1 to 5
  dining: number; // 1 to 5
  activities: number; // 1 to 5
  pace: ItineraryPace;
}

export interface FoodPreferences {
  dietary: string[];
  cuisines: string[];
  custom_notes?: string;
  is_skipped?: boolean;
}

export interface Trip {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  destination_country: string;
  destination_image: string;
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
  duration_days: number;
  travel_group: TravelGroup;
  budget_tier: BudgetTier;
  total_budget_usd: number;
  currency?: string;
  travel_dna: string[];
  priority_tags: string[];
  food_preferences?: FoodPreferences;
  fine_tune: FineTunePreferences;
  status: 'draft' | 'curating' | 'curated' | 'finalized' | 'completed';
  created_at: string;
  updated_at: string;
  notes?: string;
}

export type RecommendationCategory =
  | 'Attractions'
  | 'Restaurants'
  | 'Hotels'
  | 'Activities'
  | 'Shopping'
  | 'Nightlife'
  | 'Transport';

export interface Recommendation {
  id: string;
  destination: string;
  name: string;
  category: RecommendationCategory;
  rating: number;
  reviews_count: number;
  price_tier: '$' | '$$' | '$$$' | '$$$$';
  estimated_cost_usd: number;
  estimated_duration_hours: number;
  description: string;
  why_recommended: string;
  tags: string[];
  image_url: string;
  location_area: string;
  coordinates?: { lat: number; lng: number };
  is_top_match?: boolean;
  alternative_to_id?: string;
  alternative_notes?: string;
}

export type TimeSlot = 'Morning' | 'Afternoon' | 'Evening';

export interface SelectedItem {
  id: string;
  trip_id: string;
  recommendation_id: string;
  day_number: number; // 1, 2, 3...
  time_slot: TimeSlot;
  order_index: number;
  custom_notes?: string;
  recommendation?: Recommendation;
}

export interface BudgetBreakdown {
  accommodations: number;
  dining: number;
  activities: number;
  transport_other: number;
  total_estimated: number;
  budget_goal: number;
  difference: number;
}

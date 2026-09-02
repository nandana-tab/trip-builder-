import { BudgetTier } from '../types';
import { CurrencyCode, getCurrencyConfig, convertUSDToCurrency, formatRawAmount } from './currency';

export type DestinationCostLevel = 'ultra-low' | 'low' | 'moderate' | 'high' | 'ultra-high';

export interface DestinationCostProfile {
  destinationKey: string;
  matchedName: string;
  country: string;
  costLevel: DestinationCostLevel;
  costMultiplier: number; // 1.0 = standard global baseline
  tagline: string;
  dailyRangesUSD: {
    budget: { min: number; max: number; avg: number; label: string };
    'mid-range': { min: number; max: number; avg: number; label: string };
    premium: { min: number; max: number; avg: number; label: string };
    luxury: { min: number; max: number; avg: number; label: string };
  };
  accommodationPerNightUSD: {
    budget: number;
    'mid-range': number;
    premium: number;
    luxury: number;
  };
}

// Pre-defined geographic cost profiles
const COST_PROFILES: Record<string, DestinationCostProfile> = {
  india: {
    destinationKey: 'india',
    matchedName: 'India',
    country: 'India',
    costLevel: 'ultra-low',
    costMultiplier: 0.25,
    tagline: 'High Purchasing Power • Great Value Street Eats & Heritage Haveli Stays',
    dailyRangesUSD: {
      budget: { min: 12, max: 25, avg: 15, label: 'Zostel & boutique dorms, street kachori/chai, autos & local trains' },
      'mid-range': { min: 35, max: 70, avg: 48, label: 'Heritage havelis, AC cabs, royal thali dinners & fort tickets' },
      premium: { min: 85, max: 170, avg: 120, label: '4 & 5-star heritage hotels, private chauffeur & fine dining' },
      luxury: { min: 220, max: 550, avg: 320, label: 'Palace hotels (Rambagh, Taj Lake Palace, Oberoi) & royal tours' }
    },
    accommodationPerNightUSD: {
      budget: 12,
      'mid-range': 40,
      premium: 95,
      luxury: 280
    }
  },
  southeast_asia: {
    destinationKey: 'southeast_asia',
    matchedName: 'Southeast Asia & Bali',
    country: 'Indonesia / Thailand / Vietnam',
    costLevel: 'low',
    costMultiplier: 0.35,
    tagline: 'High Value • Tropical Villas, Warungs & Island Scooters',
    dailyRangesUSD: {
      budget: { min: 18, max: 38, avg: 26, label: 'Design hostels, warungs & night markets, scooter rentals & beach hikes' },
      'mid-range': { min: 55, max: 110, avg: 80, label: 'Boutique jungle villas, trendy cafes, spa treatments & speedboats' },
      premium: { min: 130, max: 260, avg: 180, label: 'Private pool luxury villas, beach clubs & private yacht charters' },
      luxury: { min: 350, max: 800, avg: 480, label: 'Bulgari/Four Seasons clifftop resorts & private helicopter charters' }
    },
    accommodationPerNightUSD: {
      budget: 18,
      'mid-range': 65,
      premium: 150,
      luxury: 420
    }
  },
  china: {
    destinationKey: 'china',
    matchedName: 'China',
    country: 'China',
    costLevel: 'low',
    costMultiplier: 0.50,
    tagline: 'Moderate Cost • Ancient Hutongs, High-Speed Rail & Imperial Feasts',
    dailyRangesUSD: {
      budget: { min: 25, max: 50, avg: 35, label: 'Hutong courtyard hostels, jianbing street stalls & metro' },
      'mid-range': { min: 70, max: 140, avg: 100, label: 'Boutique courtyard stays, roast duck dinners & Great Wall transfers' },
      premium: { min: 170, max: 340, avg: 240, label: 'The Peninsula / PuLi urban resorts & private tour curators' },
      luxury: { min: 420, max: 1000, avg: 650, label: 'Palatial suites & UltraViolet 3-star multi-sensory dining' }
    },
    accommodationPerNightUSD: {
      budget: 25,
      'mid-range': 80,
      premium: 200,
      luxury: 520
    }
  },
  japan: {
    destinationKey: 'japan',
    matchedName: 'Japan',
    country: 'Japan',
    costLevel: 'moderate',
    costMultiplier: 0.85,
    tagline: 'Balanced Currency Value • Ramen Alleys, Bullet Trains & Historic Shrines',
    dailyRangesUSD: {
      budget: { min: 40, max: 75, avg: 52, label: 'Artisan pod hostels, ramen & yakitori alleys, Suica metro passes' },
      'mid-range': { min: 120, max: 220, avg: 160, label: 'Modern design hotels, izakaya dining & Shinkansen bullet trains' },
      premium: { min: 260, max: 480, avg: 340, label: 'Onsen ryokans with kaiseki dinners & private tea ceremonies' },
      luxury: { min: 600, max: 1300, avg: 850, label: 'Aman / Hoshinoya suites, 3-star Michelin sushi & master guides' }
    },
    accommodationPerNightUSD: {
      budget: 42,
      'mid-range': 130,
      premium: 290,
      luxury: 720
    }
  },
  southern_europe: {
    destinationKey: 'southern_europe',
    matchedName: 'Southern Europe',
    country: 'Portugal / Spain / Greece / Southern Italy',
    costLevel: 'moderate',
    costMultiplier: 0.75,
    tagline: 'Moderate European Cost • Pastel Miradouros, Tapas & Coastal Ferries',
    dailyRangesUSD: {
      budget: { min: 38, max: 70, avg: 50, label: 'Boutique hostels, pastelarias, tapas counters & walking tours' },
      'mid-range': { min: 110, max: 210, avg: 150, label: 'Charming character hotels, seafood trattorias & regional trains' },
      premium: { min: 250, max: 460, avg: 320, label: '4-star heritage boutique stays, vineyard tours & private catamarans' },
      luxury: { min: 550, max: 1200, avg: 780, label: 'Cliffside villas, Michelin degustation & private boat skippers' }
    },
    accommodationPerNightUSD: {
      budget: 38,
      'mid-range': 120,
      premium: 260,
      luxury: 620
    }
  },
  paris_france: {
    destinationKey: 'paris_france',
    matchedName: 'Paris & France',
    country: 'France',
    costLevel: 'high',
    costMultiplier: 1.20,
    tagline: 'High European Cost • Belle Époque Cafes, Metro & World-Class Art',
    dailyRangesUSD: {
      budget: { min: 65, max: 115, avg: 85, label: 'Design hostels (Les Piaules), boulangeries, crêperies & Metro passes' },
      'mid-range': { min: 180, max: 320, avg: 240, label: 'Left Bank boutique hotels, classic bistros & museum passes' },
      premium: { min: 380, max: 650, avg: 480, label: '4 & 5-star Haussmannian hotels, Michelin dinners & private Seine cruises' },
      luxury: { min: 750, max: 1600, avg: 1050, label: 'Palace hotels (Le Ritz, Plaza Athénée), private yacht charters & VIP guides' }
    },
    accommodationPerNightUSD: {
      budget: 65,
      'mid-range': 190,
      premium: 420,
      luxury: 950
    }
  },
  united_states: {
    destinationKey: 'united_states',
    matchedName: 'United States',
    country: 'United States',
    costLevel: 'high',
    costMultiplier: 1.25,
    tagline: 'High Cost • Iconic Diners, Broadway Arts & City Transit',
    dailyRangesUSD: {
      budget: { min: 75, max: 130, avg: 95, label: 'Boutique hostels / micro-hotels, slice shops, food halls & subway' },
      'mid-range': { min: 220, max: 380, avg: 280, label: 'Boutique design hotels, neighborhood trattorias & Broadway shows' },
      premium: { min: 450, max: 800, avg: 580, label: '5-star luxury hotels, Michelin fine dining & private car transfers' },
      luxury: { min: 900, max: 2000, avg: 1250, label: 'The Carlyle / St. Regis suites, bespoke VIP concierge & private charters' }
    },
    accommodationPerNightUSD: {
      budget: 75,
      'mid-range': 220,
      premium: 490,
      luxury: 1100
    }
  },
  united_kingdom: {
    destinationKey: 'united_kingdom',
    matchedName: 'United Kingdom',
    country: 'United Kingdom',
    costLevel: 'high',
    costMultiplier: 1.15,
    tagline: 'High Cost • Historic Inns, Borough Markets & West End Culture',
    dailyRangesUSD: {
      budget: { min: 60, max: 110, avg: 80, label: 'Vault hostels, Borough Market street bites, tube & free galleries' },
      'mid-range': { min: 170, max: 300, avg: 220, label: 'Point A / Highland inns, gastro pubs & West End theatre tickets' },
      premium: { min: 350, max: 650, avg: 460, label: 'Savoy / Gleneagles lodge, fine dining & private distillery tours' },
      luxury: { min: 750, max: 1600, avg: 1050, label: 'Claridge’s suites, private helicopter loch flights & personal butler' }
    },
    accommodationPerNightUSD: {
      budget: 62,
      'mid-range': 180,
      premium: 400,
      luxury: 950
    }
  },
  luxury_haven: {
    destinationKey: 'luxury_haven',
    matchedName: 'High-Cost Alpine & Coastal Havens',
    country: 'Switzerland / Iceland / Monaco / Amalfi / Norway',
    costLevel: 'ultra-high',
    costMultiplier: 1.45,
    tagline: 'Premium Destination • Scenic Glaciers, Mountain Railways & Cliffside Views',
    dailyRangesUSD: {
      budget: { min: 85, max: 145, avg: 110, label: 'Alpine youth lodges, bakery lunches, scenic hiking & public rail' },
      'mid-range': { min: 250, max: 440, avg: 330, label: 'Scenic chalet hotels, fondue & trattoria dinners & mountain gondolas' },
      premium: { min: 500, max: 900, avg: 680, label: '5-star panoramic spa resorts, Michelin mountain dining & private tours' },
      luxury: { min: 1100, max: 2500, avg: 1600, label: 'Bespoke helicopter transfers, private clifftop chalets & private yachts' }
    },
    accommodationPerNightUSD: {
      budget: 85,
      'mid-range': 260,
      premium: 580,
      luxury: 1400
    }
  },
  global_default: {
    destinationKey: 'global_default',
    matchedName: 'Worldwide Standard',
    country: 'Global',
    costLevel: 'moderate',
    costMultiplier: 1.0,
    tagline: 'Global Average Baseline',
    dailyRangesUSD: {
      budget: { min: 45, max: 80, avg: 60, label: 'Hostels & guesthouses, street eats & public transit' },
      'mid-range': { min: 140, max: 250, avg: 180, label: 'Boutique hotels, local restaurants & guided day tours' },
      premium: { min: 300, max: 550, avg: 400, label: '4 & 5-star hotels, fine dining & private transport' },
      luxury: { min: 650, max: 1400, avg: 900, label: 'Luxury resorts, chef tasting tables & bespoke services' }
    },
    accommodationPerNightUSD: {
      budget: 45,
      'mid-range': 140,
      premium: 320,
      luxury: 750
    }
  }
};

/**
 * Resolves a destination name / country string into a destination cost profile.
 */
export function getDestinationCostProfile(destination: string = '', country: string = ''): DestinationCostProfile {
  const query = `${destination} ${country}`.toLowerCase().trim();

  // 1. India & Subcontinent
  if (
    query.includes('india') ||
    query.includes('jaipur') ||
    query.includes('delhi') ||
    query.includes('mumbai') ||
    query.includes('goa') ||
    query.includes('kerala') ||
    query.includes('varanasi') ||
    query.includes('rajasthan') ||
    query.includes('agra') ||
    query.includes('bangalore') ||
    query.includes('chennai') ||
    query.includes('kolkata') ||
    query.includes('udaipur') ||
    query.includes('nepal') ||
    query.includes('sri lanka')
  ) {
    return COST_PROFILES.india;
  }

  // 2. Southeast Asia & Bali
  if (
    query.includes('bali') ||
    query.includes('indonesia') ||
    query.includes('thailand') ||
    query.includes('bangkok') ||
    query.includes('phuket') ||
    query.includes('vietnam') ||
    query.includes('hanoi') ||
    query.includes('cambodia') ||
    query.includes('philippines') ||
    query.includes('ubud') ||
    query.includes('canggu')
  ) {
    return COST_PROFILES.southeast_asia;
  }

  // 3. China
  if (
    query.includes('china') ||
    query.includes('beijing') ||
    query.includes('shanghai') ||
    query.includes('chengdu') ||
    query.includes('xi\'an')
  ) {
    return COST_PROFILES.china;
  }

  // 4. Japan
  if (
    query.includes('japan') ||
    query.includes('tokyo') ||
    query.includes('kyoto') ||
    query.includes('osaka') ||
    query.includes('sapporo')
  ) {
    return COST_PROFILES.japan;
  }

  // 5. Paris / France
  if (
    query.includes('paris') ||
    query.includes('france') ||
    query.includes('lyon') ||
    query.includes('nice') ||
    query.includes('bordeaux')
  ) {
    return COST_PROFILES.paris_france;
  }

  // 6. United States
  if (
    query.includes('united states') ||
    query.includes('usa') ||
    query.includes('new york') ||
    query.includes('nyc') ||
    query.includes('los angeles') ||
    query.includes('san francisco') ||
    query.includes('chicago') ||
    query.includes('miami') ||
    query.includes('las vegas') ||
    query.includes('hawaii')
  ) {
    return COST_PROFILES.united_states;
  }

  // 7. United Kingdom
  if (
    query.includes('united kingdom') ||
    query.includes('london') ||
    query.includes('scottish') ||
    query.includes('highlands') ||
    query.includes('edinburgh') ||
    query.includes('england') ||
    query.includes('scotland') ||
    query.includes('uk')
  ) {
    return COST_PROFILES.united_kingdom;
  }

  // 8. Luxury Alpine / High Cost
  if (
    query.includes('switzerland') ||
    query.includes('zurich') ||
    query.includes('geneva') ||
    query.includes('iceland') ||
    query.includes('reykjavik') ||
    query.includes('norway') ||
    query.includes('oslo') ||
    query.includes('monaco') ||
    query.includes('amalfi') ||
    query.includes('capri') ||
    query.includes('positano')
  ) {
    return COST_PROFILES.luxury_haven;
  }

  // 9. Southern Europe / Moderate
  if (
    query.includes('portugal') ||
    query.includes('lisbon') ||
    query.includes('spain') ||
    query.includes('madrid') ||
    query.includes('barcelona') ||
    query.includes('greece') ||
    query.includes('athens') ||
    query.includes('rome') ||
    query.includes('italy') ||
    query.includes('florence') ||
    query.includes('venice')
  ) {
    return COST_PROFILES.southern_europe;
  }

  return COST_PROFILES.global_default;
}

/**
 * Returns formatted daily range string for a given tier in the user's active currency,
 * calibrated accurately to the destination's cost profile.
 */
export function getFormattedTierDailyRange(
  destination: string,
  country: string,
  tier: BudgetTier,
  currencyCode: CurrencyCode = 'USD'
): string {
  const profile = getDestinationCostProfile(destination, country);
  const rangeUSD = profile.dailyRangesUSD[tier];
  const currConfig = getCurrencyConfig(currencyCode);

  const minConverted = Math.round(rangeUSD.min * currConfig.rateAgainstUSD);
  const maxConverted = Math.round(rangeUSD.max * currConfig.rateAgainstUSD);

  if (tier === 'luxury') {
    return `${currConfig.symbol}${minConverted.toLocaleString()}+`;
  }
  return `${currConfig.symbol}${minConverted.toLocaleString()} – ${currConfig.symbol}${maxConverted.toLocaleString()}`;
}

/**
 * Returns the average daily USD per person for the given destination and budget tier.
 */
export function getDestinationDailyAvgUSD(
  destination: string,
  country: string,
  tier: BudgetTier
): number {
  const profile = getDestinationCostProfile(destination, country);
  return profile.dailyRangesUSD[tier].avg;
}

/**
 * Calculates adaptive slider limits (min, max, step) for a specific destination, duration, and group size.
 */
export function getDestinationSliderRange(
  destination: string,
  country: string,
  currencyCode: CurrencyCode = 'USD',
  durationDays: number = 7,
  groupSize: number = 1
): { min: number; max: number; step: number; defaultBudgetUSD: number } {
  const profile = getDestinationCostProfile(destination, country);
  const currConfig = getCurrencyConfig(currencyCode);

  // Calculate base USD totals
  const minUSD = Math.max(30, Math.round(profile.dailyRangesUSD.budget.min * durationDays * groupSize));
  const maxUSD = Math.max(500, Math.round(profile.dailyRangesUSD.luxury.min * 1.6 * durationDays * groupSize));
  const defaultUSD = Math.round(profile.dailyRangesUSD['mid-range'].avg * durationDays * groupSize);

  // Convert to currency
  const minConverted = Math.max(10, Math.round(minUSD * currConfig.rateAgainstUSD));
  const maxConverted = Math.round(maxUSD * currConfig.rateAgainstUSD);

  // Pick clean step
  let step = 50;
  if (currConfig.rateAgainstUSD > 50) {
    step = 500; // for JPY, INR
  } else if (currConfig.rateAgainstUSD > 5) {
    step = 100;
  } else {
    step = 25;
  }

  return {
    min: minConverted,
    max: maxConverted,
    step,
    defaultBudgetUSD: defaultUSD
  };
}

export interface DestinationInfo {
  name: string;
  country: string;
  tagline: string;
  image: string;
  bestSeason: string;
  avgDailyBudget: number;
  highlightTags: string[];
}

export const POPULAR_DESTINATIONS: DestinationInfo[] = [
  {
    name: 'India',
    country: 'India',
    tagline: 'Royal palaces of Rajasthan, fragrant spice bazaars & majestic heritage forts',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'October to March (Pleasant & Cool)',
    avgDailyBudget: 130,
    highlightTags: ['Royal Palaces', 'Heritage Forts', 'Rich Culinary Culture']
  },
  {
    name: 'United States',
    country: 'United States',
    tagline: 'Manhattan skylines, Broadway arts, iconic landmarks & world-class dining',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'Spring (Apr–Jun) & Autumn (Sep–Nov)',
    avgDailyBudget: 320,
    highlightTags: ['World-Class Arts', 'Skyline Vistas', 'Diverse Gastronomy']
  },
  {
    name: 'China',
    country: 'China',
    tagline: 'The Imperial Forbidden City, ancient Great Wall & dazzling futuristic skylines',
    image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'September to November & April to May',
    avgDailyBudget: 170,
    highlightTags: ['Imperial Heritage', 'Great Wall Wonders', 'Culinary Traditions']
  },
  {
    name: 'United Kingdom',
    country: 'United Kingdom',
    tagline: 'Royal West End theatres, historic Thames landmarks & quintessential gardens',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'May to September',
    avgDailyBudget: 260,
    highlightTags: ['Royal Heritage', 'West End Arts', 'Iconic Pubs & Markets']
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    tagline: 'Neon skylines, ancient shrines & Michelin-star culinary alleys',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'Spring (Mar–May) & Autumn (Sep–Nov)',
    avgDailyBudget: 220,
    highlightTags: ['Culinary Haven', 'Tradition & Modernity', 'Safe & Fast Transit']
  },
  {
    name: 'Kyoto',
    country: 'Japan',
    tagline: 'Centuries of Zen gardens, bamboo groves & geisha districts',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'Spring & Autumn',
    avgDailyBudget: 190,
    highlightTags: ['Zen Temples', 'Tea Ceremonies', 'Historic Inns']
  },
  {
    name: 'Amalfi Coast',
    country: 'Italy',
    tagline: 'Cliffside lemon groves, azure Mediterranean waters & pastel villages',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'Late Spring (May–Jun) & Early Autumn (Sep–Oct)',
    avgDailyBudget: 340,
    highlightTags: ['Coastal Views', 'Fresh Seafood', 'Luxury Escapes']
  },
  {
    name: 'Lisbon',
    country: 'Portugal',
    tagline: 'Sun-drenched cobblestones, fado music & pastel-hued miradouros',
    image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'April to October',
    avgDailyBudget: 160,
    highlightTags: ['Vibrant Culture', 'Affordable Luxury', 'Pastéis de Nata']
  },
  {
    name: 'Bali',
    country: 'Indonesia',
    tagline: 'Emerald rice terraces, spiritual water temples & coastal surf sunsets',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'May to September (Dry Season)',
    avgDailyBudget: 110,
    highlightTags: ['Wellness & Yoga', 'Volcanic Landscapes', 'Tropical Villas']
  },
  {
    name: 'Paris',
    country: 'France',
    tagline: 'Haussmannian boulevards, world-class art collections & sidewalk bistros',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'Spring & Autumn',
    avgDailyBudget: 280,
    highlightTags: ['Art & Architecture', 'Haute Gastronomy', 'Romantic Walks']
  },
  {
    name: 'Scottish Highlands',
    country: 'United Kingdom',
    tagline: 'Dramatic lochs, ancient castles, misty glens & single-malt distilleries',
    image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'May to September',
    avgDailyBudget: 210,
    highlightTags: ['Wild Nature', 'Historic Castles', 'Scenic Road Trips']
  },
  {
    name: 'Rome',
    country: 'Italy',
    tagline: 'Colosseum ruins, espresso bar culture & cinematic fountain piazzas',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    bestSeason: 'April to June & September to November',
    avgDailyBudget: 240,
    highlightTags: ['Living History', 'Trattoria Classics', 'Renaissance Art']
  }
];

export const TRAVEL_DNA_OPTIONS = [
  { id: 'culinary', label: 'Local Cuisine & Fine Dining', icon: 'restaurant', description: 'Michelin counters, street food markets & wine tastings' },
  { id: 'culture_history', label: 'Art, Architecture & History', icon: 'museum', description: 'Hidden museums, historic landmarks & heritage tours' },
  { id: 'hidden_gems', label: 'Off-the-Beaten-Path Gems', icon: 'explore', description: 'Local neighborhood haunts & secret scenic viewpoints' },
  { id: 'relaxation_wellness', label: 'Relaxation & Wellness', icon: 'spa', description: 'Thermal baths, rooftop lounges & slow-paced mornings' },
  { id: 'nature_scenery', label: 'Nature & Scenic Landscapes', icon: 'landscape', description: 'Coastal cliffs, botanical gardens & mountain vistas' },
  { id: 'nightlife_bars', label: 'Cocktail Lounges & Nightlife', icon: 'nightlife', description: 'Speakeasies, jazz clubs & vibrant late-night spots' },
  { id: 'shopping_artisan', label: 'Boutiques & Artisan Crafts', icon: 'shopping_bag', description: 'Local makers, ceramic studios & vintage finds' },
  { id: 'active_adventure', label: 'Active Adventures & Treks', icon: 'hiking', description: 'Scenic hikes, cycling routes & coastal water sports' }
];

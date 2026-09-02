export interface DietaryOption {
  id: string;
  label: string;
  badge: string;
  icon: string;
  description: string;
}

export interface CuisineStyleOption {
  id: string;
  label: string;
  badge: string;
  icon: string;
  description: string;
}

export const DIETARY_OPTIONS: DietaryOption[] = [
  {
    id: 'non_veg',
    label: 'Non-Vegetarian / No Restrictions',
    badge: '🥩 Omnivore',
    icon: 'restaurant_menu',
    description: 'Open to all culinary offerings including meat, poultry, seafood, game & regional delicacies.'
  },
  {
    id: 'vegetarian',
    label: 'Vegetarian',
    badge: '🌱 Plant & Dairy',
    icon: 'spa',
    description: 'Plant-forward dishes, legumes, dairy & eggs. No meat, poultry, or fish.'
  },
  {
    id: 'vegan',
    label: 'Vegan (100% Plant-Based)',
    badge: '🥑 Strictly Vegan',
    icon: 'eco',
    description: 'Strictly 100% plant-based with zero dairy, eggs, meat, honey or animal derivatives.'
  },
  {
    id: 'pescatarian',
    label: 'Pescatarian',
    badge: '🐟 Fish & Seafood',
    icon: 'set_meal',
    description: 'Fresh seafood, wild-caught fish, shellfish, eggs & dairy alongside plant-based meals.'
  },
  {
    id: 'halal',
    label: 'Halal-Friendly',
    badge: '🕌 Halal Certified',
    icon: 'verified',
    description: 'Halal certified meats, pork-free kitchens, and alcohol-conscious preparation.'
  },
  {
    id: 'gluten_free',
    label: 'Gluten-Free Friendly',
    badge: '🌾 Celiac Safe',
    icon: 'grass',
    description: 'Wheat-free, dedicated gluten-free kitchens, and celiac-conscious dining establishments.'
  },
  {
    id: 'jain',
    label: 'Jain / Sattvic Friendly',
    badge: '🌿 Pure Sattvic',
    icon: 'nature',
    description: 'Pure vegetarian meals prepared strictly without onion, garlic, or root vegetables.'
  },
  {
    id: 'dairy_free',
    label: 'Dairy-Free / Lactose-Free',
    badge: '🥛 Dairy-Free',
    icon: 'local_cafe',
    description: 'Plant milks, dairy-free pastries, cheeses, and lactose-conscious cooking.'
  }
];

export const CUISINE_STYLE_OPTIONS: CuisineStyleOption[] = [
  {
    id: 'local_authentic',
    label: 'Authentic Local Specialties',
    badge: 'Heritage Classic',
    icon: 'ramen_dining',
    description: 'Iconic local institutions, heritage recipes, regional noodles, authentic tapas & trattorias.'
  },
  {
    id: 'street_food',
    label: 'Street Food & Night Markets',
    badge: 'Night Stalls',
    icon: 'kebab_dining',
    description: 'Bustling alleyway vendors, sizzling skewers, night market bites, bao buns & food carts.'
  },
  {
    id: 'cafes_bakeries',
    label: 'Artisan Cafes & Bakeries',
    badge: 'Third-Wave Coffee',
    icon: 'bakery_dining',
    description: 'Specialty pour-over coffee bars, flaky laminated pastries, matcha tearooms & brunch terraces.'
  },
  {
    id: 'fine_dining',
    label: 'Fine Dining & Chef’s Tasting',
    badge: 'Michelin Star',
    icon: 'dinner_dining',
    description: 'Multi-course tasting menus, omakase counters, table d’hôte & innovative gastronomy.'
  },
  {
    id: 'seafood_fresh',
    label: 'Coastal Seafood & Fresh Catch',
    badge: 'Ocean Fresh',
    icon: 'set_meal',
    description: 'Morning harbor fish auctions, oyster bars, dockside seafood grills & ceviche bars.'
  },
  {
    id: 'farm_to_table',
    label: 'Farm-to-Table & Organic',
    badge: 'Clean & Sustainable',
    icon: 'nutrition',
    description: 'Regenerative farm produce, seasonal garden salads, cold-pressed elixirs & whole food bowls.'
  },
  {
    id: 'comfort_casual',
    label: 'Cozy Bistros & Izakayas',
    badge: 'Convivial Drinks',
    icon: 'local_bar',
    description: 'Relaxed neighborhood taverns, izakayas, tapas bars, craft beer lounges & shared plates.'
  },
  {
    id: 'global_fusion',
    label: 'Global & Contemporary Fusion',
    badge: 'Modern Fusion',
    icon: 'public',
    description: 'Cross-cultural culinary experiments blending heritage spices with modern techniques.'
  }
];

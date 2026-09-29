export type ScentFamily = 'Floral' | 'Fresh & Citrus' | 'Woody & Earthy' | 'Warm & Amber' | 'Aquatic & Clean';

export interface PerfumeProduct {
  id: string;
  name: string;
  subtitle: string;
  city: string;
  country: string;
  coordinates: string;
  inspiredBy: string;
  category: ScentFamily;
  price50ml: number;
  price100ml: number;
  samplePrice?: number;
  description: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  keyAccords: string[];
  longevity: '6-8 hours' | '8-10 hours' | '10-12 hours' | 'All Day';
  sillage: 'Intimate' | 'Moderate' | 'Strong' | 'Enveloping';
  gender: 'Unisex' | 'Feminine Leaning' | 'Masculine Leaning';
  rating: number;
  reviewsCount: number;
  paletteColors: {
    name: string;
    hex: string;
    desc: string;
  }[];
  image?: string;
  isBestseller?: boolean;
  isNew?: boolean;
}

export interface PackageTier {
  id: 'first-class' | 'business-class' | 'regular-class';
  name: string;
  tagline: string;
  badge?: string;
  priceEstimate: string;
  basePriceNum: number;
  features: string[];
  bulletNotes: {
    highlight: string;
    detail: string;
  }[];
  maxScents: number;
  includedSessionsOrSets: string;
}

export interface StagBacheloretteConfig {
  name: string;
  description: string;
  bridesmaidMaxScents: number;
  groomsmenMaxScents: number;
  features: string[];
  priceRange: string;
}

export interface AddOnOption {
  id: 'bride-groom' | 'entourage-gift';
  title: string;
  description: string;
  items: string[];
  specs: string;
  priceEstimate: string;
  priceNum: number;
}

export interface SpecialEventsPaxTier {
  id: string;
  paxRange: string;
  label: string;
  minPax: number;
  maxPax: number;
  bottleSize: string;
  unitPriceEstimate: number;
  turnaroundDays: string;
  popularFor: string;
}

export interface CartItem {
  cartId: string;
  productId: string;
  productName: string;
  city: string;
  coordinates: string;
  size: '10ml Roller' | '50ml Bottle' | '100ml Bottle' | 'Discovery Set (10 Scents)' | 'Discovery Set (20 Scents)';
  price: number;
  quantity: number;
  customEngraving?: string;
  giftBox: boolean;
  image?: string;
}

export interface EventQuoteRequest {
  eventType: 'Wedding' | 'Debut' | 'Baby Shower' | 'Stag / Bachelorette' | 'Special Event / Corporate';
  packageTier?: string;
  paxTier?: string;
  paxCount: number;
  targetDate: string;
  eventLocation: string;
  selectedScents: string[];
  addOnBrideGroom: boolean;
  addOnEntourage: boolean;
  customBottleNames: string;
  customCoordinatesOrCity: string;
  clientName: string;
  clientEmail: string;
  clientContact: string;
  notes: string;
}

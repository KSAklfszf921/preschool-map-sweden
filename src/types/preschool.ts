export interface Preschool {
  id: string;
  name: string;
  address: string;
  municipality: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  phone?: string;
  email?: string;
  website?: string;
  description: string;
  ageRange: string;
  capacity: number;
  openingHours: string;
  languages: string[];
  specialties: string[];
  rating: number;
  imageUrl?: string;
}

export interface Municipality {
  id: string;
  name: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface SearchFilters {
  municipality?: string;
  specialty?: string;
  language?: string;
  minRating?: number;
}
export type TripStatus = 'PLANNING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
export type TripItemType =
  | 'FLIGHT'
  | 'HOTEL'
  | 'ACTIVITY'
  | 'RESTAURANT'
  | 'TRANSPORT'
  | 'NOTE'
  | 'OTHER';

export interface TripItem {
  id: string;
  tripId: string;
  itemType: TripItemType;
  title: string;
  description?: string;
  dayNumber: number;
  startTime?: string;
  endTime?: string;
  location?: string;
  cost?: number;
  currency?: string;
  notes?: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  name: string;
  userId: string;
  destinationId?: string;
  destination?: {
    id: string;
    name: string;
    country: string;
    imageUrl?: string;
  };
  startDate?: string;
  endDate?: string;
  status: TripStatus;
  notes?: string;
  tripItems: TripItem[];
  _count?: { tripItems: number };
  createdAt: string;
  updatedAt: string;
}

export interface CreateTripDto {
  name: string;
  destinationId?: string;
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface CreateTripItemDto {
  itemType: TripItemType;
  title: string;
  description?: string;
  dayNumber: number;
  startTime?: string;
  endTime?: string;
  location?: string;
  cost?: number;
  currency?: string;
  notes?: string;
}

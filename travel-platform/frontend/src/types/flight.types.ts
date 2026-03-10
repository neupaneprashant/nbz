export interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
  countryName: string;
}

export interface FlightSegment {
  departure: { airport: string; time: string };
  arrival: { airport: string; time: string };
  carrier: string;
  flightNumber: string;
  duration: string;
}

export interface FlightItinerary {
  duration: string;
  stops: number;
  segments: FlightSegment[];
}

export interface FlightPrice {
  total: string;
  currency: string;
  perPerson: string;
}

export interface FlightOffer {
  id: string;
  airline: string;
  airlineName: string;
  price: FlightPrice;
  itineraries: FlightItinerary[];
  seats: number;
  lastTicketingDate: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
}

export interface FlightSearchResult {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  results: FlightOffer[];
  totalResults: number;
}

export interface FlightEndpoint {
  airport: string;
  iataCode: string;
  scheduled: string;
  estimated: string;
  actual: string | null;
  delay: number | null;
  terminal: string | null;
  gate: string | null;
  baggage?: string | null;
}

export interface FlightStatus {
  flightDate: string;
  flightNumber: string;
  status: 'scheduled' | 'active' | 'landed' | 'cancelled' | 'diverted' | 'unknown';
  departure: FlightEndpoint;
  arrival: FlightEndpoint;
  airline: { name: string; iataCode: string };
  aircraft: { registration: string; iataCode: string; model: string } | null;
}

export interface FlightStatusResult {
  flightNumber: string;
  results: FlightStatus[];
  lastUpdated: string;
}

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

export interface FlightOffer {
  id: string;
  airline: string;
  airlineName: string;
  price: {
    total: string;
    currency: string;
    perPerson: string;
  };
  itineraries: FlightItinerary[];
  seats: number;
  lastTicketingDate: string;
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

export interface Airport {
  iataCode: string;
  name: string;
  cityName: string;
  countryCode: string;
  countryName: string;
}

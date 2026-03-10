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
  status:
    | 'scheduled'
    | 'active'
    | 'landed'
    | 'cancelled'
    | 'diverted'
    | 'unknown';
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

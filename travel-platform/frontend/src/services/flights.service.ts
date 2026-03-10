import type {
  Airport,
  FlightSearchParams,
  FlightSearchResult,
  FlightStatus,
  FlightStatusResult,
} from '../types/flight.types';
import api from './api';

export const flightsService = {
  async searchFlights(params: FlightSearchParams): Promise<FlightSearchResult> {
    const response = await api.post<FlightSearchResult>('/flights/search', params);
    return response.data;
  },
  async searchAirports(keyword: string): Promise<Airport[]> {
    const response = await api.get<Airport[]>('/flights/airports', {
      params: { keyword },
    });
    return response.data;
  },
  async getSearchHistory() {
    const response = await api.get('/flights/search/history');
    return response.data;
  },
  async getFlightStatus(flightNumber: string): Promise<FlightStatusResult> {
    const response = await api.get<FlightStatusResult>(`/flights/status/${flightNumber}`);
    return response.data;
  },
  async getFlightsByRoute(origin: string, destination: string): Promise<FlightStatus[]> {
    const response = await api.get<FlightStatus[]>('/flights/route', {
      params: { origin, destination },
    });
    return response.data;
  },
  async getDepartures(airportCode: string): Promise<FlightStatus[]> {
    const response = await api.get<FlightStatus[]>(`/flights/departures/${airportCode}`);
    return response.data;
  },
  async getArrivals(airportCode: string): Promise<FlightStatus[]> {
    const response = await api.get<FlightStatus[]>(`/flights/arrivals/${airportCode}`);
    return response.data;
  },
};

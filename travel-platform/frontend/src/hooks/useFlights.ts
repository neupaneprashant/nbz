import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { flightsService } from '../services/flights.service';
import type { FlightSearchParams } from '../types/flight.types';

export function useFlightSearch() {
  const mutation = useMutation({
    mutationFn: (params: FlightSearchParams) => flightsService.searchFlights(params),
  });

  return {
    search: mutation.mutateAsync,
    results: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}

export function useAirportSearch(keyword: string) {
  const [debounced, setDebounced] = useState(keyword);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(keyword), 400);
    return () => clearTimeout(timer);
  }, [keyword]);

  return useQuery({
    queryKey: ['airport-search', debounced],
    queryFn: () => flightsService.searchAirports(debounced),
    enabled: debounced.length >= 2,
  });
}

export function useSearchHistory() {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: ['flight-search-history'],
    queryFn: () => flightsService.getSearchHistory(),
    enabled: isAuthenticated,
  });

  return useMemo(() => query, [query]);
}

export function useFlightStatus(flightNumber: string | null) {
  return useQuery({
    queryKey: ['flightStatus', flightNumber],
    queryFn: () => flightsService.getFlightStatus(flightNumber as string),
    enabled: !!flightNumber && flightNumber.length >= 4,
    refetchInterval: 60000,
    staleTime: 30000,
  });
}

export function useFlightsByRoute(origin: string, destination: string) {
  return useQuery({
    queryKey: ['flightsByRoute', origin, destination],
    queryFn: () => flightsService.getFlightsByRoute(origin, destination),
    enabled: origin.length === 3 && destination.length === 3,
  });
}

export function useDepartures(airportCode: string) {
  return useQuery({
    queryKey: ['departures', airportCode],
    queryFn: () => flightsService.getDepartures(airportCode),
    enabled: airportCode.length === 3,
    refetchInterval: 120000,
  });
}

export function useArrivals(airportCode: string) {
  return useQuery({
    queryKey: ['arrivals', airportCode],
    queryFn: () => flightsService.getArrivals(airportCode),
    enabled: airportCode.length === 3,
    refetchInterval: 120000,
  });
}

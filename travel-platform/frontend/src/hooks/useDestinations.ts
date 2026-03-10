import { useQuery } from '@tanstack/react-query';
import { destinationsService } from '../services/destinations.service';

export const useDestinations = (filters?: { country?: string; featured?: boolean }) =>
  useQuery({
    queryKey: ['destinations', filters],
    queryFn: () => destinationsService.getAll(filters),
  });

export const useFeaturedDestinations = () =>
  useQuery({
    queryKey: ['destinations', 'featured'],
    queryFn: () => destinationsService.getFeatured(),
  });

export const useDestination = (id?: string) =>
  useQuery({
    queryKey: ['destinations', id],
    queryFn: () => destinationsService.getById(id as string),
    enabled: Boolean(id),
  });

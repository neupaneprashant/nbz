import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tripsService } from '../services/trips.service';
import type { CreateTripDto, CreateTripItemDto } from '../types/trip.types';

export function useMyTrips() {
  return useQuery({ queryKey: ['trips'], queryFn: tripsService.getMyTrips });
}

export function useTrip(id: string) {
  return useQuery({
    queryKey: ['trips', id],
    queryFn: () => tripsService.getTripById(id),
    enabled: !!id,
  });
}

export function useTripPublic(id: string) {
  return useQuery({
    queryKey: ['trip-public', id],
    queryFn: () => tripsService.getTripPublic(id),
    enabled: !!id,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTripDto) => tripsService.createTrip(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  });
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateTripDto> & { status?: string } }) =>
      tripsService.updateTrip(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      queryClient.invalidateQueries({ queryKey: ['trips', id] });
    },
  });
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tripsService.deleteTrip(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['trips'] }),
  });
}

export function useAddTripItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, data }: { tripId: string; data: CreateTripItemDto }) =>
      tripsService.addTripItem(tripId, data),
    onSuccess: (_, { tripId }) =>
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] }),
  });
}

export function useUpdateTripItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, itemId, data }: { tripId: string; itemId: string; data: Partial<CreateTripItemDto> }) =>
      tripsService.updateTripItem(tripId, itemId, data),
    onSuccess: (_, { tripId }) =>
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] }),
  });
}

export function useDeleteTripItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tripId, itemId }: { tripId: string; itemId: string }) =>
      tripsService.deleteTripItem(tripId, itemId),
    onSuccess: (_, { tripId }) =>
      queryClient.invalidateQueries({ queryKey: ['trips', tripId] }),
  });
}

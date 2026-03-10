import type { CreateTripDto, CreateTripItemDto } from '../types/trip.types';
import api from './api';

export const tripsService = {
  async getMyTrips() {
    const res = await api.get('/trips');
    return res.data;
  },
  async getTripById(id: string) {
    const res = await api.get(`/trips/${id}`);
    return res.data;
  },
  async getTripPublic(id: string) {
    const res = await api.get(`/trips/${id}/public`);
    return res.data;
  },
  async createTrip(data: CreateTripDto) {
    const res = await api.post('/trips', data);
    return res.data;
  },
  async updateTrip(id: string, data: Partial<CreateTripDto> & { status?: string }) {
    const res = await api.patch(`/trips/${id}`, data);
    return res.data;
  },
  async deleteTrip(id: string) {
    const res = await api.delete(`/trips/${id}`);
    return res.data;
  },
  async addTripItem(tripId: string, data: CreateTripItemDto) {
    const res = await api.post(`/trips/${tripId}/items`, data);
    return res.data;
  },
  async updateTripItem(tripId: string, itemId: string, data: Partial<CreateTripItemDto>) {
    const res = await api.patch(`/trips/${tripId}/items/${itemId}`, data);
    return res.data;
  },
  async deleteTripItem(tripId: string, itemId: string) {
    const res = await api.delete(`/trips/${tripId}/items/${itemId}`);
    return res.data;
  },
};

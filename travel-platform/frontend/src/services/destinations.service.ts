import type { Destination } from '../types/destination.types';
import api from './api';

export const destinationsService = {
  async getAll(filters?: { country?: string; featured?: boolean }) {
    const response = await api.get<Destination[]>('/destinations', { params: filters });
    return response.data;
  },
  async getFeatured() {
    const response = await api.get<Destination[]>('/destinations/featured');
    return response.data;
  },
  async getById(id: string) {
    const response = await api.get<Destination>(`/destinations/${id}`);
    return response.data;
  },
};

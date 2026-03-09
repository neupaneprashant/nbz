export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  imageUrl?: string;
  bestSeason?: string;
  averageBudget?: number;
  featured: boolean;
  createdAt: string;
}

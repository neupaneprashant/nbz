import { Link } from 'react-router-dom';
import type { Destination } from '../../types/destination.types';

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="overflow-hidden rounded-xl bg-white shadow transition hover:scale-[1.01] hover:shadow-lg">
      <div className="relative h-44">
        {destination.imageUrl ? (
          <img src={destination.imageUrl} alt={destination.name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-sky-400 to-indigo-500" />
        )}
        <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-1 text-xs font-medium">{destination.country}</span>
      </div>
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-bold">{destination.name}</h3>
        <p className="line-clamp-2 text-sm text-slate-600">{destination.description}</p>
        <p className="text-sm">🌤️ {destination.bestSeason ?? 'Year-round'}</p>
        <p className="text-sm">💰 {destination.averageBudget ? `~$${destination.averageBudget}/day` : 'Contact for pricing'}</p>
        <Link to={`/destinations/${destination.id}`} className="inline-block rounded bg-sky-600 px-3 py-2 text-sm text-white">Explore</Link>
      </div>
    </article>
  );
}

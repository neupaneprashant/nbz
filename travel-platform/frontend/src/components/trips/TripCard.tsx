import { Link } from 'react-router-dom';
import type { Trip } from '../../types/trip.types';
import TripStatusBadge from './TripStatusBadge';

export default function TripCard({
  trip,
  onDelete,
}: {
  trip: Trip;
  onDelete: (id: string) => void;
}) {
  const confirmDelete = () => {
    if (window.confirm('Delete this trip?')) onDelete(trip.id);
  };

  return (
    <article className="overflow-hidden rounded-xl bg-white shadow transition hover:scale-[1.01]">
      {trip.destination?.imageUrl ? (
        <img src={trip.destination.imageUrl} className="h-40 w-full object-cover" />
      ) : (
        <div className="h-40 w-full bg-gradient-to-r from-sky-500 to-indigo-500" />
      )}
      <div className="space-y-2 p-4">
        <h3 className="text-lg font-bold">{trip.name}</h3>
        <p className="text-sm text-slate-600">
          {trip.destination ? `${trip.destination.name}, ${trip.destination.country}` : 'No destination linked'}
        </p>
        <p className="text-xs text-slate-500">
          {trip.startDate && trip.endDate
            ? `${new Date(trip.startDate).toLocaleDateString()} - ${new Date(trip.endDate).toLocaleDateString()}`
            : 'No dates set'}
        </p>
        <p className="text-xs text-slate-500">{trip._count?.tripItems ?? trip.tripItems?.length ?? 0} items planned</p>
        <TripStatusBadge status={trip.status} />
      </div>
      <div className="flex items-center justify-between border-t p-3">
        <Link className="rounded bg-sky-600 px-3 py-2 text-sm text-white" to={`/trips/${trip.id}`}>View Details</Link>
        <details className="relative">
          <summary className="cursor-pointer list-none rounded px-2 py-1">⋮</summary>
          <div className="absolute right-0 z-10 mt-1 rounded border bg-white shadow">
            <button className="block w-full px-3 py-2 text-left text-sm" onClick={confirmDelete}>Delete</button>
          </div>
        </details>
      </div>
    </article>
  );
}

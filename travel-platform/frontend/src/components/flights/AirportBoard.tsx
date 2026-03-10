import type { FlightStatus } from '../../types/flight.types';
import FlightStatusBadge from './FlightStatusBadge';

export default function AirportBoard({
  flights,
  type,
  isLoading,
}: {
  flights: FlightStatus[];
  type: 'departures' | 'arrivals';
  isLoading: boolean;
}) {
  const sorted = [...flights].sort(
    (a, b) =>
      new Date(a.departure.scheduled || a.arrival.scheduled).getTime() -
      new Date(b.departure.scheduled || b.arrival.scheduled).getTime(),
  );

  if (isLoading) {
    return <div className="space-y-2">{Array.from({ length: 5 }).map((_,i)=><div key={i} className="h-10 animate-pulse rounded bg-slate-100" />)}</div>;
  }

  if (sorted.length === 0) return <p>No flights found</p>;

  return (
    <div className="overflow-x-auto rounded-xl border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
          <tr>
            <th className="p-3">Time</th><th className="p-3">Flight</th>
            <th className="p-3">{type === 'departures' ? 'Destination' : 'Origin'}</th>
            <th className="p-3">Terminal</th><th className="p-3">Gate</th>
            {type === 'arrivals' && <th className="p-3">Baggage</th>}
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((f, idx) => {
            const endpoint = type === 'departures' ? f.departure : f.arrival;
            const place = type === 'departures' ? f.arrival : f.departure;
            return (
              <tr key={`${f.flightNumber}-${idx}`} className={`${idx % 2 ? 'bg-slate-50' : 'bg-white'} ${f.status === 'cancelled' ? 'opacity-60' : ''}`}>
                <td className={`p-3 ${(endpoint.delay ?? 0) > 0 ? 'text-orange-600' : ''}`}>{new Date(endpoint.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className="p-3">{f.flightNumber}</td>
                <td className="p-3">{place.iataCode}</td>
                <td className="p-3">{endpoint.terminal ?? '—'}</td>
                <td className="p-3">{endpoint.gate ?? '—'}</td>
                {type === 'arrivals' && <td className="p-3">{f.arrival.baggage ?? '—'}</td>}
                <td className="p-3"><FlightStatusBadge status={f.status} size="sm" /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

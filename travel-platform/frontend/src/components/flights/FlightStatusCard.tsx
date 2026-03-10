import type { FlightStatus } from '../../types/flight.types';
import FlightStatusBadge from './FlightStatusBadge';
import FlightTimeDisplay from './FlightTimeDisplay';

const borderColor: Record<FlightStatus['status'], string> = {
  scheduled: 'border-blue-500',
  active: 'border-green-500',
  landed: 'border-gray-400',
  cancelled: 'border-red-500',
  diverted: 'border-orange-500',
  unknown: 'border-gray-400',
};

export default function FlightStatusCard({ flight }: { flight: FlightStatus }) {
  const updated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return (
    <article className={`rounded-xl border-l-4 bg-white p-4 shadow ${borderColor[flight.status]}`}>
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold">{flight.airline.name} {flight.flightNumber}</h3>
        </div>
        <FlightStatusBadge status={flight.status} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="font-semibold">{flight.departure.airport} ({flight.departure.iataCode})</p>
          <FlightTimeDisplay label="Departure" scheduled={flight.departure.scheduled} estimated={flight.departure.estimated} actual={flight.departure.actual} delay={flight.departure.delay} />
          {flight.departure.terminal && <p className="text-xs">Terminal {flight.departure.terminal}</p>}
          {flight.departure.gate && <p className="text-xs">Gate {flight.departure.gate}</p>}
        </div>
        <div>
          <p className="font-semibold">{flight.arrival.airport} ({flight.arrival.iataCode})</p>
          <FlightTimeDisplay label="Arrival" scheduled={flight.arrival.scheduled} estimated={flight.arrival.estimated} actual={flight.arrival.actual} delay={flight.arrival.delay} />
          {flight.arrival.terminal && <p className="text-xs">Terminal {flight.arrival.terminal}</p>}
          {flight.arrival.gate && <p className="text-xs">Gate {flight.arrival.gate}</p>}
          {flight.arrival.baggage && <p className="text-xs">Baggage Belt {flight.arrival.baggage}</p>}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
        <span>Flight date: {flight.flightDate}</span>
        {flight.aircraft?.model && <span>Aircraft: {flight.aircraft.model}</span>}
        <span>Last updated: {updated}</span>
      </div>
    </article>
  );
}

import { useFlightStatus } from '../../hooks/useFlights';
import FlightStatusCard from './FlightStatusCard';
import FlightStatusBadge from './FlightStatusBadge';

export default function FlightStatusWidget({
  flightNumber,
  compact = false,
}: {
  flightNumber: string;
  compact?: boolean;
}) {
  const { data, isLoading, isError } = useFlightStatus(flightNumber);

  if (isLoading) return <div className="h-12 animate-pulse rounded bg-slate-100" />;
  if (isError || !data?.results?.[0]) return <div className="text-sm text-slate-500">Status unavailable</div>;

  const flight = data.results[0];

  if (!compact) return <FlightStatusCard flight={flight} />;

  return (
    <div className="flex flex-wrap items-center gap-2 rounded border bg-white p-2 text-sm">
      <FlightStatusBadge status={flight.status} size="sm" />
      <span>{flight.flightNumber}</span>
      <span>|</span>
      <span>{flight.departure.iataCode} → {flight.arrival.iataCode}</span>
      <span>|</span>
      <span>Dep: {new Date(flight.departure.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      <span>|</span>
      <span>Arr: {new Date(flight.arrival.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
    </div>
  );
}

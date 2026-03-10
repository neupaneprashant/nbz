import type { FlightStatus } from '../../types/flight.types';

const styles: Record<FlightStatus['status'], { label: string; cls: string; icon: string }> = {
  scheduled: { label: 'Scheduled', cls: 'bg-blue-100 text-blue-700', icon: '🕐' },
  active: { label: 'In Flight', cls: 'bg-green-100 text-green-700', icon: '✈️' },
  landed: { label: 'Landed', cls: 'bg-slate-200 text-slate-700', icon: '🛬' },
  cancelled: { label: 'Cancelled', cls: 'bg-red-100 text-red-700', icon: '❌' },
  diverted: { label: 'Diverted', cls: 'bg-orange-100 text-orange-700', icon: '⚠️' },
  unknown: { label: 'Unknown', cls: 'bg-slate-200 text-slate-700', icon: '❓' },
};

export default function FlightStatusBadge({
  status,
  size = 'md',
}: {
  status: FlightStatus['status'];
  size?: 'sm' | 'md' | 'lg';
}) {
  const sz = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1.5' : 'text-xs px-2.5 py-1';
  const item = styles[status] ?? styles.unknown;
  return <span className={`inline-flex items-center gap-1 rounded-full font-medium ${sz} ${item.cls}`}>{item.icon} {item.label}</span>;
}

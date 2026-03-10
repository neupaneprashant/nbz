import type { TripStatus } from '../../types/trip.types';

const map: Record<TripStatus, { cls: string; label: string; icon: string }> = {
  PLANNING: { cls: 'bg-blue-100 text-blue-700', label: 'Planning', icon: '📝' },
  CONFIRMED: { cls: 'bg-green-100 text-green-700', label: 'Confirmed', icon: '✅' },
  COMPLETED: { cls: 'bg-slate-200 text-slate-700', label: 'Completed', icon: '🏁' },
  CANCELLED: { cls: 'bg-red-100 text-red-700', label: 'Cancelled', icon: '❌' },
};

export default function TripStatusBadge({ status }: { status: TripStatus }) {
  const item = map[status];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${item.cls}`}>{item.icon} {item.label}</span>;
}

import type { TripItemType } from '../../types/trip.types';

const iconMap: Record<TripItemType, string> = {
  FLIGHT: '✈️',
  HOTEL: '🏨',
  ACTIVITY: '🎯',
  RESTAURANT: '🍽️',
  TRANSPORT: '🚗',
  NOTE: '📝',
  OTHER: '📌',
};

export default function TripItemIcon({
  itemType,
  size = 'md',
}: {
  itemType: TripItemType;
  size?: 'sm' | 'md' | 'lg';
}) {
  const cls = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg';
  return <span className={cls}>{iconMap[itemType]}</span>;
}

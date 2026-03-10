import { useState } from 'react';
import type { TripItem } from '../../types/trip.types';
import TripItemIcon from './TripItemIcon';

export default function TripItemCard({
  item,
  onEdit,
  onDelete,
  readOnly = false,
}: {
  item: TripItem;
  onEdit?: (item: TripItem) => void;
  onDelete?: (item: TripItem) => void;
  readOnly?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <article className="rounded-lg border bg-white p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-sky-50 p-2"><TripItemIcon itemType={item.itemType} /></div>
        <div className="flex-1">
          <h4 className="font-semibold">{item.title}</h4>
          {(item.startTime || item.endTime) && <p className="text-xs text-slate-600">{item.startTime ?? '—'} - {item.endTime ?? '—'}</p>}
          {item.location && <p className="text-xs text-slate-600">📍 {item.location}</p>}
          {item.cost != null && <p className="text-xs text-slate-600">💰 {item.currency ?? 'USD'} {item.cost}</p>}
          {item.description && (
            <p className="text-xs text-slate-500">
              {expanded ? item.description : `${item.description.slice(0, 80)}${item.description.length > 80 ? '...' : ''}`}
              {item.description.length > 80 && (
                <button className="ml-1 underline" onClick={() => setExpanded((v) => !v)}>{expanded ? 'less' : 'more'}</button>
              )}
            </p>
          )}
        </div>
        {!readOnly && (
          <div className="flex gap-1">
            <button className="text-sm" onClick={() => onEdit?.(item)}>✏️</button>
            <button className="text-sm" onClick={() => onDelete?.(item)}>🗑️</button>
          </div>
        )}
      </div>
    </article>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AddTripItemModal from '../../components/trips/AddTripItemModal';
import TripItemCard from '../../components/trips/TripItemCard';
import TripStatusBadge from '../../components/trips/TripStatusBadge';
import { useDeleteTrip, useDeleteTripItem, useTrip, useUpdateTrip } from '../../hooks/useTrips';
import { useToast } from '../../context/ToastContext';
import type { TripItem } from '../../types/trip.types';
import FlightStatusWidget from '../../components/flights/FlightStatusWidget';

export default function TripDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { data: trip, isLoading } = useTrip(id);
  const updateTrip = useUpdateTrip();
  const deleteTrip = useDeleteTrip();
  const deleteItem = useDeleteTripItem();
  const [view, setView] = useState<'day' | 'list'>('day');
  const [modalDay, setModalDay] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<TripItem | undefined>();

  const maxDay = Math.max(1, ...(trip?.tripItems?.map((i: any) => i.dayNumber) ?? [1]));
  const [days, setDays] = useState(maxDay);

  const grouped = useMemo(() => {
    const map = new Map<number, TripItem[]>();
    (trip?.tripItems ?? []).forEach((item: TripItem) => {
      const arr = map.get(item.dayNumber) ?? [];
      arr.push(item);
      map.set(item.dayNumber, arr);
    });
    return map;
  }, [trip?.tripItems]);

  const totalCost = (trip?.tripItems ?? []).reduce((sum: number, i: any) => sum + (i.cost ?? 0), 0);
  const flightItems = (trip?.tripItems ?? []).filter((i: any) => i.itemType === 'FLIGHT');

  if (isLoading) return <div className="h-64 animate-pulse rounded bg-slate-100" />;
  if (!trip) return <p>Trip not found</p>;

  const handleDeleteTrip = async () => {
    if (!window.confirm('Delete this trip?')) return;
    await deleteTrip.mutateAsync(trip.id);
    showToast('Trip deleted', 'success');
    navigate('/trips');
  };

  const copyShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/trips/${trip.id}/summary`);
    showToast('Share link copied!', 'success');
  };

  return (
    <div className="space-y-6">
      <Link to="/trips" className="text-sm text-sky-600">← My Trips</Link>
      <div className="rounded-xl bg-white p-4 shadow">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <input
              className="text-2xl font-bold outline-none"
              value={trip.name}
              onChange={(e) => updateTrip.mutate({ id: trip.id, data: { name: e.target.value } })}
            />
            <p className="text-slate-600">{trip.destination?.name ?? 'No destination'}</p>
          </div>
          <div className="flex items-center gap-2">
            <TripStatusBadge status={trip.status} />
            <select value={trip.status} onChange={(e) => updateTrip.mutate({ id: trip.id, data: { status: e.target.value as any } })} className="rounded border p-1 text-sm">
              <option value="PLANNING">Planning</option><option value="CONFIRMED">Confirmed</option><option value="COMPLETED">Completed</option><option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <span>Total Days: {days}</span>
          <span>Total Items: {trip.tripItems.length}</span>
          <span>Estimated Cost: USD {totalCost.toFixed(2)}</span>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="rounded border px-3 py-1 text-sm" onClick={copyShare}>Share Trip</button>
          <button className="rounded border border-red-300 px-3 py-1 text-sm text-red-600" onClick={handleDeleteTrip}>Delete Trip</button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button className={`rounded border px-3 py-1 text-sm ${view==='day'?'bg-sky-600 text-white':''}`} onClick={() => setView('day')}>Day View</button>
          <button className={`rounded border px-3 py-1 text-sm ${view==='list'?'bg-sky-600 text-white':''}`} onClick={() => setView('list')}>List View</button>
        </div>
        <button className="rounded bg-sky-600 px-3 py-1 text-sm text-white" onClick={() => setDays((d)=>d+1)}>Add Day</button>
      </div>

      {view === 'day' ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {Array.from({ length: days }).map((_, idx) => {
            const day = idx + 1;
            const items = grouped.get(day) ?? [];
            const dateLabel = trip.startDate ? new Date(new Date(trip.startDate).getTime() + (day - 1) * 86400000).toLocaleDateString() : null;
            return (
              <div key={day} className="min-w-[280px] flex-1 rounded-xl border bg-slate-50 p-3">
                <h3 className="mb-2 font-semibold">Day {day} {dateLabel ? `— ${dateLabel}` : ''}</h3>
                <div className="space-y-2">
                  {items.map((item) => (
                    <TripItemCard key={item.id} item={item} onEdit={(i)=>{setEditingItem(i); setModalDay(i.dayNumber);}} onDelete={(i)=>deleteItem.mutate({tripId:trip.id,itemId:i.id})} />
                  ))}
                </div>
                <button className="mt-3 w-full rounded border border-dashed px-3 py-2 text-sm" onClick={() => { setEditingItem(undefined); setModalDay(day); }}>+ Add Item</button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {[...grouped.entries()].map(([day, items]) => (
            <div key={day}>
              <h3 className="mb-2 font-semibold">Day {day}</h3>
              <div className="space-y-2">{items.map((item) => <TripItemCard key={item.id} item={item} onEdit={(i)=>{setEditingItem(i); setModalDay(i.dayNumber);}} onDelete={(i)=>deleteItem.mutate({tripId:trip.id,itemId:i.id})} />)}</div>
            </div>
          ))}
          <button className="fixed bottom-6 right-6 rounded-full bg-sky-600 px-4 py-3 text-white shadow" onClick={() => {setEditingItem(undefined); setModalDay(1);}}>+ Add Item</button>
        </div>
      )}

      {flightItems.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-xl font-bold">Flight Status</h2>
          {flightItems.map((item: any, idx: number) => {
            const found = `${item.title} ${item.description ?? ''}`.match(/[A-Z]{2}\d{1,4}/);
            if (!found) return null;
            return <FlightStatusWidget key={`${found[0]}-${idx}`} flightNumber={found[0]} compact />;
          })}
        </section>
      )}

      {modalDay && (
        <AddTripItemModal
          tripId={trip.id}
          dayNumber={modalDay}
          existingItem={editingItem}
          onClose={() => {
            setModalDay(null);
            setEditingItem(undefined);
          }}
        />
      )}
    </div>
  );
}

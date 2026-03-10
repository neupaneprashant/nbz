import { useState } from 'react';
import type { FormEvent } from 'react';
import type { TripItem, TripItemType } from '../../types/trip.types';
import { useAddTripItem, useUpdateTripItem } from '../../hooks/useTrips';

const itemTypes: TripItemType[] = ['FLIGHT','HOTEL','ACTIVITY','RESTAURANT','TRANSPORT','NOTE','OTHER'];

export default function AddTripItemModal({
  tripId,
  dayNumber,
  onClose,
  existingItem,
}: {
  tripId: string;
  dayNumber: number;
  onClose: () => void;
  existingItem?: TripItem;
}) {
  const addItem = useAddTripItem();
  const updateItem = useUpdateTripItem();
  const [itemType, setItemType] = useState<TripItemType>(existingItem?.itemType ?? 'ACTIVITY');
  const [title, setTitle] = useState(existingItem?.title ?? '');
  const [startTime, setStartTime] = useState(existingItem?.startTime ?? '');
  const [endTime, setEndTime] = useState(existingItem?.endTime ?? '');
  const [location, setLocation] = useState(existingItem?.location ?? '');
  const [cost, setCost] = useState(existingItem?.cost?.toString() ?? '');
  const [currency, setCurrency] = useState(existingItem?.currency ?? 'USD');
  const [description, setDescription] = useState(existingItem?.description ?? '');
  const [notes, setNotes] = useState(existingItem?.notes ?? '');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const data = {
      itemType,
      title,
      dayNumber: existingItem?.dayNumber ?? dayNumber,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      location: location || undefined,
      cost: cost ? Number(cost) : undefined,
      currency,
      description: description || undefined,
      notes: notes || undefined,
    };

    if (existingItem) {
      await updateItem.mutateAsync({ tripId, itemId: existingItem.id, data });
    } else {
      await addItem.mutateAsync({ tripId, data });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={submit} className="w-full max-w-lg space-y-3 rounded-xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-bold">{existingItem ? 'Update Item' : 'Add Item'}</h3>
        <div className="flex flex-wrap gap-2">
          {itemTypes.map((t) => (
            <button key={t} type="button" className={`rounded border px-2 py-1 text-xs ${itemType===t?'bg-sky-600 text-white':''}`} onClick={()=>setItemType(t)}>{t}</button>
          ))}
        </div>
        <input className="w-full rounded border p-2" placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} required />
        <div className="grid gap-2 md:grid-cols-2">
          <input type="time" className="rounded border p-2" value={startTime} onChange={(e)=>setStartTime(e.target.value)} />
          <input type="time" className="rounded border p-2" value={endTime} onChange={(e)=>setEndTime(e.target.value)} />
        </div>
        <input className="w-full rounded border p-2" placeholder="Location" value={location} onChange={(e)=>setLocation(e.target.value)} />
        <div className="grid gap-2 md:grid-cols-[1fr_120px]">
          <input className="rounded border p-2" placeholder="Cost" type="number" step="0.01" value={cost} onChange={(e)=>setCost(e.target.value)} />
          <select className="rounded border p-2" value={currency} onChange={(e)=>setCurrency(e.target.value)}>
            <option>USD</option><option>EUR</option><option>GBP</option>
          </select>
        </div>
        <textarea className="w-full rounded border p-2" placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)} />
        <textarea className="w-full rounded border p-2" placeholder="Notes" value={notes} onChange={(e)=>setNotes(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button type="button" className="rounded border px-3 py-2" onClick={onClose}>Cancel</button>
          <button className="rounded bg-sky-600 px-3 py-2 text-white">{existingItem ? 'Update Item' : 'Add Item'}</button>
        </div>
      </form>
    </div>
  );
}

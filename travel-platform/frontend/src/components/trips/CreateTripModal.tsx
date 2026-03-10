import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTrip } from '../../hooks/useTrips';
import { useDestinations } from '../../hooks/useDestinations';
import { useToast } from '../../context/ToastContext';

export default function CreateTripModal({
  onClose,
  defaultDestinationId,
}: {
  onClose: () => void;
  defaultDestinationId?: string;
}) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const createTrip = useCreateTrip();
  const { data: destinations } = useDestinations();
  const [name, setName] = useState('');
  const [destinationId, setDestinationId] = useState(defaultDestinationId ?? '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date');
      return;
    }

    try {
      const created = await createTrip.mutateAsync({
        name,
        destinationId: destinationId || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        notes: notes || undefined,
      });
      showToast('Trip created!', 'success');
      onClose();
      navigate(`/trips/${created.id}`);
    } catch {
      setError('Failed to create trip');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-3 rounded-xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-bold">Create New Trip</h3>
        {error && <p className="rounded bg-red-100 p-2 text-sm text-red-700">{error}</p>}
        <input className="w-full rounded border p-2" placeholder="Trip name" value={name} onChange={(e)=>setName(e.target.value)} required />
        <select className="w-full rounded border p-2" value={destinationId} onChange={(e)=>setDestinationId(e.target.value)}>
          <option value="">Select destination</option>
          {destinations?.map((d)=> <option key={d.id} value={d.id}>{d.name}, {d.country}</option>)}
        </select>
        <div className="grid gap-2 md:grid-cols-2">
          <input type="date" className="rounded border p-2" value={startDate} onChange={(e)=>setStartDate(e.target.value)} />
          <input type="date" className="rounded border p-2" value={endDate} onChange={(e)=>setEndDate(e.target.value)} />
        </div>
        <textarea className="w-full rounded border p-2" placeholder="Notes" value={notes} onChange={(e)=>setNotes(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button type="button" className="rounded border px-3 py-2" onClick={onClose}>Cancel</button>
          <button className="rounded bg-sky-600 px-3 py-2 text-white" disabled={createTrip.isPending}>Create Trip</button>
        </div>
      </form>
    </div>
  );
}

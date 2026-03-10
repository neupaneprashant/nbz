import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import type { FlightOffer, FlightSearchParams } from '../../types/flight.types';

interface TripOption {
  id: string;
  name?: string;
  destinationId?: string;
}

export default function SaveToTripModal({
  offer,
  onClose,
  searchParams,
}: {
  offer: FlightOffer;
  onClose: () => void;
  searchParams: FlightSearchParams;
}) {
  const { showToast } = useToast();
  const [trips, setTrips] = useState<TripOption[]>([]);
  const [selectedTripId, setSelectedTripId] = useState('');
  const [newTripName, setNewTripName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void api
      .get<TripOption[]>('/trips')
      .then((res) => setTrips(res.data))
      .catch(() => setTrips([]));
  }, []);

  const isCreateNew = selectedTripId === '__new__';
  const summary = useMemo(
    () => ({
      route: `${searchParams.origin} → ${searchParams.destination}`,
      departureDate: searchParams.departureDate,
      returnDate: searchParams.returnDate,
      price: `${offer.price.currency} ${offer.price.total}`,
    }),
    [offer.price.currency, offer.price.total, searchParams],
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      let tripId = selectedTripId;
      let tripName = 'Trip';

      if (isCreateNew) {
        const created = await api.post<{ id: string; name?: string }>('/trips', {
          name: newTripName || `Trip ${summary.route}`,
        });
        tripId = created.data.id;
        tripName = created.data.name ?? (newTripName || 'New Trip');
      } else {
        const selected = trips.find((t) => t.id === selectedTripId);
        tripName = selected?.name ?? 'Selected Trip';
      }

      await api.post(`/trips/${tripId}/items`, {
        itemType: 'FLIGHT',
        title: `Flight ${summary.route}`,
        description: JSON.stringify(summary),
        dayNumber: 1,
      });

      showToast(`Flight saved to ${tripName}!`, 'success');
      onClose();
    } catch {
      showToast('Failed to save flight to trip.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-bold">Save Flight to Trip</h3>
        <p className="mt-1 text-sm text-slate-600">
          {summary.route} • {summary.departureDate} • {summary.price}
        </p>

        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium">Add to trip</label>
          <select
            className="w-full rounded border p-2"
            value={selectedTripId}
            onChange={(e) => setSelectedTripId(e.target.value)}
          >
            <option value="">Select trip...</option>
            {trips.map((trip) => (
              <option value={trip.id} key={trip.id}>
                {trip.name ?? trip.id}
              </option>
            ))}
            <option value="__new__">Create new trip</option>
          </select>

          {isCreateNew && (
            <input
              className="w-full rounded border p-2"
              placeholder="Trip name"
              value={newTripName}
              onChange={(e) => setNewTripName(e.target.value)}
            />
          )}
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded border px-3 py-2 text-sm" onClick={onClose}>
            Cancel
          </button>
          <button
            className="rounded bg-sky-600 px-3 py-2 text-sm text-white disabled:opacity-50"
            disabled={saving || !selectedTripId}
            onClick={() => void handleSave()}
          >
            {saving ? 'Saving...' : 'Save Flight'}
          </button>
        </div>
      </div>
    </div>
  );
}

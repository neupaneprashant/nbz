/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TripCard from '../../components/trips/TripCard';
import CreateTripModal from '../../components/trips/CreateTripModal';
import { useDeleteTrip, useMyTrips } from '../../hooks/useTrips';
import { useToast } from '../../context/ToastContext';
import type { TripStatus } from '../../types/trip.types';

const tabs: Array<'ALL' | TripStatus> = ['ALL', 'PLANNING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];

export default function TripsPage() {
  const [searchParams] = useSearchParams();
  const defaultDestinationId = searchParams.get('destinationId') ?? undefined;
  const [activeTab, setActiveTab] = useState<'ALL' | TripStatus>('ALL');
  const [openModal, setOpenModal] = useState(Boolean(defaultDestinationId));
  const { showToast } = useToast();
  const { data, isLoading } = useMyTrips();
  const deleteTrip = useDeleteTrip();

  const filtered = useMemo(() => {
    const list = data ?? [];
    if (activeTab === 'ALL') return list;
    return list.filter((t: any) => t.status === activeTab);
  }, [activeTab, data]);

  const handleDelete = async (id: string) => {
    try {
      await deleteTrip.mutateAsync(id);
      showToast('Trip deleted', 'success');
    } catch {
      showToast('Failed to delete trip', 'error');
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Trips 🗺️</h1>
        <button className="rounded bg-sky-600 px-4 py-2 text-white" onClick={() => setOpenModal(true)}>+ New Trip</button>
      </div>

      <div className="flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button key={tab} className={`rounded-full border px-3 py-1 text-sm ${activeTab===tab?'bg-sky-600 text-white':''}`} onClick={() => setActiveTab(tab)}>{tab === 'ALL' ? 'All' : tab}</button>
        ))}
      </div>

      {isLoading && <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({length:3}).map((_,i)=><div key={i} className="h-64 animate-pulse rounded bg-slate-100" />)}</div>}
      {!isLoading && filtered.length === 0 && (
        <div className="rounded-xl border bg-white p-8 text-center">
          <p className="text-lg font-semibold">{activeTab === 'ALL' ? 'No trips yet' : `No ${activeTab.toLowerCase()} trips`}</p>
          <button className="mt-3 rounded bg-sky-600 px-3 py-2 text-white" onClick={() => setOpenModal(true)}>Create your first trip</button>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((trip: any) => <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />)}
      </div>

      {openModal && <CreateTripModal onClose={() => setOpenModal(false)} defaultDestinationId={defaultDestinationId} />}
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams, Link } from 'react-router-dom';
import { useTripPublic } from '../../hooks/useTrips';
import TripStatusBadge from '../../components/trips/TripStatusBadge';
import TripItemCard from '../../components/trips/TripItemCard';

export default function TripSummaryPage() {
  const { id = '' } = useParams();
  const { data, isLoading } = useTripPublic(id);

  if (isLoading) return <div className="h-64 animate-pulse rounded bg-slate-100" />;
  if (!data) return <p>Trip not found</p>;

  const grouped = data.tripItems.reduce((acc: any, item: any) => {
    acc[item.dayNumber] = acc[item.dayNumber] || [];
    acc[item.dayNumber].push(item);
    return acc;
  }, {});

  const typeCounts = data.tripItems.reduce((acc: Record<string, number>, item: any) => {
    acc[item.itemType] = (acc[item.itemType] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6 print:space-y-4">
      <section className="relative overflow-hidden rounded-xl">
        {data.destination?.imageUrl ? <img src={data.destination.imageUrl} className="h-[300px] w-full object-cover" /> : <div className="h-[300px] bg-gradient-to-r from-sky-500 to-indigo-500" />}
        <div className="absolute inset-0 bg-black/40 p-8 text-white">
          <h1 className="text-4xl font-bold">{data.name}</h1>
          <p>{data.startDate ? new Date(data.startDate).toLocaleDateString() : 'No start'} - {data.endDate ? new Date(data.endDate).toLocaleDateString() : 'No end'}</p>
        </div>
      </section>

      <section className="rounded-xl bg-white p-4 shadow">
        <p className="font-semibold">{data.destination?.name}, {data.destination?.country}</p>
        <div className="mt-2"><TripStatusBadge status={data.status} /></div>
        <p className="mt-2 text-sm text-slate-600">{Object.entries(typeCounts).map(([k,v]) => `${v} ${k}`).join(' • ')}</p>
      </section>

      <section className="space-y-4">
        {Object.keys(grouped).map((day) => (
          <div key={day}>
            <h2 className="mb-2 text-lg font-semibold">Day {day}</h2>
            <div className="space-y-2">
              {grouped[day].map((item: any, idx: number) => <TripItemCard key={idx} item={item} readOnly />)}
            </div>
          </div>
        ))}
      </section>

      <footer className="no-print text-center text-sm text-slate-600">
        <Link to="/register" className="text-sky-600">Plan your own trip at TravelPlan</Link>
        <div><button className="mt-2 rounded border px-3 py-2" onClick={() => window.print()}>Print</button></div>
      </footer>
    </div>
  );
}

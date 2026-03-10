import { Link, useParams } from 'react-router-dom';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { useDestination } from '../../hooks/useDestinations';

export default function DestinationDetailPage() {
  const { id } = useParams();
  const { data, isLoading, isError } = useDestination(id);

  if (isLoading) {
    return <div className="space-y-4"><SkeletonCard /><SkeletonCard /><SkeletonCard /></div>;
  }

  if (isError || !data) {
    return (
      <div className="text-center">
        <p>Destination not found</p>
        <Link className="text-sky-600" to="/destinations">Back</Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-xl">
        <img src={data.imageUrl} className="h-80 w-full object-cover" />
        <div className="absolute inset-0 bg-black/40 p-8 text-white">
          <h1 className="text-4xl font-bold">{data.name}</h1>
          <p>{data.country}</p>
          <Link to={`/trips/new?destinationId=${data.id}`} className="mt-4 inline-block rounded bg-sky-600 px-4 py-2">Plan a Trip</Link>
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded bg-white p-4 shadow">🌤️ Best Season: {data.bestSeason ?? 'Year-round'}</div>
        <div className="rounded bg-white p-4 shadow">💰 Average Budget: {data.averageBudget ? `~$${data.averageBudget} per day` : 'Contact for pricing'}</div>
        <div className="rounded bg-white p-4 shadow">📍 Location: {data.country}</div>
      </section>
      <section>
        <h2 className="text-2xl font-bold">About {data.name}</h2>
        <p className="text-slate-700">{data.description}</p>
      </section>
      <section className="rounded bg-white p-6 shadow">
        <h3 className="text-xl font-semibold">Ready to visit {data.name}?</h3>
        <div className="mt-3 flex gap-3">
          <Link className="rounded bg-slate-900 px-4 py-2 text-white" to={`/flights/search?destination=${encodeURIComponent(data.name)}`}>Search Flights</Link>
          <Link className="rounded bg-sky-600 px-4 py-2 text-white" to={`/trips/new?destinationId=${data.id}`}>Plan Your Trip</Link>
        </div>
      </section>
    </div>
  );
}

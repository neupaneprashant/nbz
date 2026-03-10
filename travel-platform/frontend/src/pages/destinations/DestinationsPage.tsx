import { useEffect, useState } from 'react';
import DestinationCard from '../../components/destinations/DestinationCard';
import SkeletonCard from '../../components/ui/SkeletonCard';
import { useDestinations } from '../../hooks/useDestinations';

export default function DestinationsPage() {
  const [country, setCountry] = useState('');
  const [debouncedCountry, setDebouncedCountry] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedCountry(country), 400);
    return () => clearTimeout(t);
  }, [country]);

  const { data, isLoading, isError, refetch } = useDestinations({
    country: debouncedCountry || undefined,
    featured: featuredOnly || undefined,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Explore Destinations</h1>
      <div className="flex flex-col gap-3 md:flex-row">
        <input className="rounded border p-2" placeholder="Filter by country" value={country} onChange={(e) => setCountry(e.target.value)} />
        <label className="flex items-center gap-2"><input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} /> Featured Only</label>
      </div>

      {isLoading && <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}</div>}
      {isError && <div className="rounded bg-red-100 p-3">Something went wrong. <button className="underline" onClick={() => void refetch()}>Retry</button></div>}
      {!isLoading && !isError && data?.length === 0 && <p>No destinations found</p>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{data?.map((d) => <DestinationCard key={d.id} destination={d} />)}</div>
    </div>
  );
}

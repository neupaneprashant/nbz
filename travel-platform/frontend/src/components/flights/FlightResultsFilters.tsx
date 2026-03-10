import { useEffect, useMemo, useState } from 'react';
import type { FlightOffer } from '../../types/flight.types';

export default function FlightResultsFilters({
  results,
  onFilter,
}: {
  results: FlightOffer[];
  onFilter: (filtered: FlightOffer[]) => void;
}) {
  const maxDetectedPrice = useMemo(
    () =>
      Math.max(...results.map((r) => Number.parseFloat(r.price.total || '0')), 0),
    [results],
  );
  const [maxPrice, setMaxPrice] = useState(maxDetectedPrice);
  const [stops, setStops] = useState({ direct: true, one: true, multi: true });
  const [sortBy, setSortBy] = useState('price-asc');

  useEffect(() => {
    setMaxPrice(maxDetectedPrice);
  }, [maxDetectedPrice]);

  useEffect(() => {
    const filtered = results
      .filter((r) => Number.parseFloat(r.price.total || '0') <= maxPrice)
      .filter((r) => {
        const minStops = Math.min(...r.itineraries.map((i) => i.stops));
        if (minStops === 0) return stops.direct;
        if (minStops === 1) return stops.one;
        return stops.multi;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return Number(a.price.total) - Number(b.price.total);
        if (sortBy === 'price-desc') return Number(b.price.total) - Number(a.price.total);

        const durationA = a.itineraries.reduce((sum, i) => sum + i.duration.length, 0);
        const durationB = b.itineraries.reduce((sum, i) => sum + i.duration.length, 0);
        return durationA - durationB;
      });

    onFilter(filtered);
  }, [maxPrice, onFilter, results, sortBy, stops]);

  return (
    <aside className="space-y-4 rounded-xl border bg-white p-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Max price: ${Math.round(maxPrice)}</label>
        <input
          type="range"
          min={0}
          max={Math.max(maxDetectedPrice, 1)}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />
      </div>
      <div className="space-y-1 text-sm">
        <p className="font-medium">Stops</p>
        <label className="block"><input type="checkbox" checked={stops.direct} onChange={(e) => setStops((s) => ({ ...s, direct: e.target.checked }))} /> Direct</label>
        <label className="block"><input type="checkbox" checked={stops.one} onChange={(e) => setStops((s) => ({ ...s, one: e.target.checked }))} /> 1 Stop</label>
        <label className="block"><input type="checkbox" checked={stops.multi} onChange={(e) => setStops((s) => ({ ...s, multi: e.target.checked }))} /> 2+ Stops</label>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Sort by</label>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full rounded border p-2 text-sm">
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="duration">Duration</option>
        </select>
      </div>
    </aside>
  );
}

import { useEffect, useRef, useState } from 'react';
import { useAirportSearch } from '../../hooks/useFlights';
import Spinner from '../ui/Spinner';
import type { Airport } from '../../types/flight.types';

interface AirportAutocompleteProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (iataCode: string, airport: Airport) => void;
  error?: string;
}

export default function AirportAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  error,
}: AirportAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading } = useAirportSearch(query);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options = data ?? [];

  const selectAirport = (airport: Airport) => {
    setQuery(`${airport.cityName} (${airport.iataCode})`);
    onChange(airport.iataCode, airport);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <input
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (!open || options.length === 0) return;
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setHighlightedIndex((i) => Math.min(i + 1, options.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            selectAirport(options[highlightedIndex]);
          } else if (e.key === 'Escape') {
            setOpen(false);
          }
        }}
        className="w-full rounded border p-2 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {open && query.length >= 2 && (
        <div className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded border bg-white shadow-lg">
          {isLoading && (
            <div className="flex items-center gap-2 p-3 text-sm text-slate-500">
              <Spinner size="sm" /> Searching airports...
            </div>
          )}
          {!isLoading && options.length === 0 && (
            <div className="p-3 text-sm text-slate-500">No airports found</div>
          )}
          {!isLoading &&
            options.map((airport, index) => (
              <button
                key={`${airport.iataCode}-${airport.name}`}
                type="button"
                className={`w-full px-3 py-2 text-left text-sm hover:bg-sky-50 ${
                  highlightedIndex === index ? 'bg-sky-50' : ''
                }`}
                onClick={() => selectAirport(airport)}
              >
                <div>
                  {airport.iataCode} — {airport.cityName}, {airport.countryName}
                </div>
                <div className="text-xs text-slate-500">{airport.name}</div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import AirportAutocomplete from '../../components/flights/AirportAutocomplete';
import FlightOfferCard from '../../components/flights/FlightOfferCard';
import FlightResultsFilters from '../../components/flights/FlightResultsFilters';
import FlightSkeletonCard from '../../components/flights/FlightSkeletonCard';
import { useFlightSearch } from '../../hooks/useFlights';
import type { FlightOffer } from '../../types/flight.types';

export default function FlightSearchPage() {
  const [urlSearchParams] = useSearchParams();
  const destinationQuery = urlSearchParams.get('destination');
  const initialDestination = destinationQuery
    ? {
        iataCode: destinationQuery.slice(0, 3).toUpperCase(),
        display: destinationQuery,
      }
    : { iataCode: '', display: '' };

  const { search, results, isLoading, isError, error } = useFlightSearch();
  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('round-trip');
  const [origin, setOrigin] = useState({ iataCode: '', display: '' });
  const [destination, setDestination] = useState(initialDestination);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [filteredResults, setFilteredResults] = useState<FlightOffer[]>([]);

  const validate = () => {
    const errors: Record<string, string> = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!origin.iataCode) errors.origin = 'Origin is required';
    if (!destination.iataCode) errors.destination = 'Destination is required';
    if (origin.iataCode && destination.iataCode && origin.iataCode === destination.iataCode) {
      errors.destination = 'Origin and destination cannot be the same';
    }
    if (!departureDate) errors.departureDate = 'Departure date is required';
    if (departureDate && new Date(departureDate) < today) {
      errors.departureDate = 'Departure date cannot be in the past';
    }
    if (tripType === 'round-trip') {
      if (!returnDate) errors.returnDate = 'Return date is required';
      if (returnDate && departureDate && new Date(returnDate) <= new Date(departureDate)) {
        errors.returnDate = 'Return date must be after departure date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const currentSearchParams = useMemo(
    () => ({
      origin: origin.iataCode,
      destination: destination.iataCode,
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      passengers,
    }),
    [departureDate, destination.iataCode, origin.iataCode, passengers, returnDate, tripType],
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const response = await search(currentSearchParams);
    setFilteredResults(response.results);

    setTimeout(() => {
      document.getElementById('flight-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const apiErrorMessage = (error as Error | undefined)?.message;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Search Flights ✈️</h1>
        <p className="text-slate-600">Find the best flights for your next trip.</p>
      </header>

      <div className="inline-flex rounded-lg border p-1">
        <button
          className={`rounded px-4 py-2 text-sm ${tripType === 'one-way' ? 'bg-sky-600 text-white' : ''}`}
          onClick={() => setTripType('one-way')}
          type="button"
        >
          One Way
        </button>
        <button
          className={`rounded px-4 py-2 text-sm ${tripType === 'round-trip' ? 'bg-sky-600 text-white' : ''}`}
          onClick={() => setTripType('round-trip')}
          type="button"
        >
          Round Trip
        </button>
      </div>

      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 rounded-xl bg-white p-5 shadow">
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <AirportAutocomplete
            label="Origin"
            placeholder="Search origin airport"
            value={origin.display || origin.iataCode}
            onChange={(iataCode, airport) => setOrigin({ iataCode, display: `${airport.cityName} (${iataCode})` })}
            error={formErrors.origin}
          />
          <button
            type="button"
            className="rounded border px-3 py-2"
            onClick={() => {
              const o = origin;
              const d = destination;
              setOrigin(d);
              setDestination(o);
            }}
          >
            ↔️
          </button>
          <AirportAutocomplete
            label="Destination"
            placeholder="Search destination airport"
            value={destination.display || destination.iataCode}
            onChange={(iataCode, airport) =>
              setDestination({ iataCode, display: `${airport.cityName} (${iataCode})` })
            }
            error={formErrors.destination}
          />
        </div>

        <div className={`grid gap-3 ${tripType === 'round-trip' ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
          <div>
            <label className="mb-1 block text-sm font-medium">Departure date</label>
            <input
              type="date"
              className="w-full rounded border p-2"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
            />
            {formErrors.departureDate && (
              <p className="mt-1 text-xs text-red-600">{formErrors.departureDate}</p>
            )}
          </div>
          {tripType === 'round-trip' && (
            <div>
              <label className="mb-1 block text-sm font-medium">Return date</label>
              <input
                type="date"
                className="w-full rounded border p-2"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
              {formErrors.returnDate && (
                <p className="mt-1 text-xs text-red-600">{formErrors.returnDate}</p>
              )}
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">Passengers</label>
            <div className="flex items-center gap-2 rounded border p-2">
              <button type="button" onClick={() => setPassengers((p) => Math.max(1, p - 1))}>
                −
              </button>
              <span className="w-8 text-center">{passengers}</span>
              <button type="button" onClick={() => setPassengers((p) => Math.min(9, p + 1))}>
                +
              </button>
            </div>
          </div>
        </div>

        <button type="submit" className="w-full rounded-lg bg-sky-600 px-4 py-3 text-white">
          Search Flights
        </button>
      </form>

      <section id="flight-results" className="space-y-4">
        {isLoading && (
          <div className="space-y-3">
            <FlightSkeletonCard />
            <FlightSkeletonCard />
            <FlightSkeletonCard />
          </div>
        )}

        {isError && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            {apiErrorMessage ||
              'No flights found for this route. Try different dates or airports.'}
          </div>
        )}

        {!isLoading && !isError && results && (
          <>
            <div className="rounded bg-slate-100 p-3 text-sm">
              Found {results.totalResults} flights from {results.origin} to{' '}
              {results.destination}
            </div>
            {results.totalResults === 0 ? (
              <div className="rounded-lg border bg-white p-8 text-center text-slate-600">
                <p className="text-lg font-semibold">
                  No flights available for this route and date
                </p>
                <p>Try nearby dates or alternate airports.</p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
                <FlightResultsFilters
                  results={results.results}
                  onFilter={setFilteredResults}
                />
                <div className="space-y-3">
                  {filteredResults.length === 0 && (
                    <div className="rounded-lg border bg-white p-8 text-center text-slate-600">
                      No results match your filters.
                    </div>
                  )}
                  {filteredResults.map((offer) => (
                    <FlightOfferCard
                      key={offer.id}
                      offer={offer}
                      passengers={results.passengers}
                      searchParams={currentSearchParams}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

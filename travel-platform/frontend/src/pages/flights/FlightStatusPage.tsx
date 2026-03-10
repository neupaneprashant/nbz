/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import AirportAutocomplete from '../../components/flights/AirportAutocomplete';
import AirportBoard from '../../components/flights/AirportBoard';
import FlightStatusCard from '../../components/flights/FlightStatusCard';
import { useArrivals, useDepartures, useFlightStatus } from '../../hooks/useFlights';

export default function FlightStatusPage() {
  const [searchParams] = useSearchParams();
  const queryFlight = searchParams.get('flight') ?? '';
  const [flightNumber, setFlightNumber] = useState(queryFlight);
  const [submittedFlight, setSubmittedFlight] = useState<string | null>(queryFlight || null);
  const [activeTab, setActiveTab] = useState<'flight' | 'departures' | 'arrivals'>('flight');
  const [recent, setRecent] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('recent_flight_searches') || '[]');
    } catch {
      return [];
    }
  });
  const [airport, setAirport] = useState('');

  const statusQuery = useFlightStatus(submittedFlight);
  const departuresQuery = useDepartures(activeTab === 'departures' ? airport : '');
  const arrivalsQuery = useArrivals(activeTab === 'arrivals' ? airport : '');

  useEffect(() => {
    if (!queryFlight) return;
    setActiveTab('flight');
    setSubmittedFlight(queryFlight);
  }, [queryFlight]);

  const groupedByDate = useMemo(() => {
    const map = new Map<string, any[]>();
    (statusQuery.data?.results ?? []).forEach((f) => {
      const arr = map.get(f.flightDate) ?? [];
      arr.push(f);
      map.set(f.flightDate, arr);
    });
    return map;
  }, [statusQuery.data?.results]);

  const [selectedDate, setSelectedDate] = useState<string>('');
  const visibleFlights = useMemo(() => {
    if (!selectedDate) return statusQuery.data?.results ?? [];
    return groupedByDate.get(selectedDate) ?? [];
  }, [groupedByDate, selectedDate, statusQuery.data?.results]);

  const submitFlight = (e?: FormEvent) => {
    e?.preventDefault();
    const cleaned = flightNumber.toUpperCase().replace(/\s+/g, '');
    setFlightNumber(cleaned);
    setSubmittedFlight(cleaned);
    const next = [cleaned, ...recent.filter((r) => r !== cleaned)].slice(0, 5);
    setRecent(next);
    localStorage.setItem('recent_flight_searches', JSON.stringify(next));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Flight Status Tracker 🛫</h1>
        <p className="text-slate-600">Track real-time status for any flight worldwide</p>
      </header>

      <div className="flex gap-3 border-b">
        {['flight', 'departures', 'arrivals'].map((tab) => (
          <button
            key={tab}
            className={`pb-2 text-sm ${activeTab === tab ? 'border-b-2 border-sky-600 font-semibold text-sky-700' : 'text-slate-500'}`}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab === 'flight' ? 'Track by Flight Number' : tab === 'departures' ? 'Departures' : 'Arrivals'}
          </button>
        ))}
      </div>

      {activeTab === 'flight' && (
        <section className="space-y-4">
          <form onSubmit={submitFlight} className="rounded-xl bg-white p-4 shadow">
            <input
              className="w-full rounded border p-3 text-lg"
              placeholder="Enter flight number e.g. BA123, AA456"
              value={flightNumber}
              onChange={(e) => setFlightNumber(e.target.value.toUpperCase())}
            />
            <p className="mt-1 text-xs text-slate-500">Enter airline code + flight number</p>
            <button className="mt-3 w-full rounded bg-sky-600 p-3 text-white md:w-auto">Track Flight</button>
          </form>

          {statusQuery.isLoading && <div className="space-y-3"><div className="h-40 animate-pulse rounded bg-slate-100" /><div className="h-40 animate-pulse rounded bg-slate-100" /></div>}
          {statusQuery.isError && <div className="rounded bg-red-50 p-3 text-red-700">Service unavailable, please try again.</div>}
          {statusQuery.data && (
            <div className="space-y-3">
              <div className="rounded bg-slate-100 p-3 text-sm">
                Showing {statusQuery.data.results.length} result(s) for {statusQuery.data.flightNumber}
                <span className="ml-2 text-slate-500">🔄 Auto-refreshes every 60 seconds</span>
              </div>

              {groupedByDate.size > 1 && (
                <div className="flex flex-wrap gap-2">
                  {[...groupedByDate.keys()].map((date) => (
                    <button key={date} onClick={() => setSelectedDate(date)} className={`rounded border px-2 py-1 text-xs ${selectedDate===date?'bg-sky-600 text-white':''}`}>{date}</button>
                  ))}
                </div>
              )}

              {visibleFlights.map((f, i) => <FlightStatusCard key={`${f.flightNumber}-${i}`} flight={f} />)}
            </div>
          )}

          {recent.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold">Recent Searches</h3>
              <div className="flex flex-wrap gap-2">
                {recent.map((chip) => (
                  <button key={chip} className="rounded-full border px-3 py-1 text-xs" onClick={() => { setFlightNumber(chip); setSubmittedFlight(chip); }}>
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab !== 'flight' && (
        <section className="space-y-4">
          <AirportAutocomplete
            label={`Select airport for ${activeTab}`}
            placeholder="Search airport"
            value={airport}
            onChange={(iataCode) => setAirport(iataCode)}
          />
          <div className="text-xs text-slate-500">Last updated: {new Date().toLocaleTimeString()}</div>
          <AirportBoard
            type={activeTab}
            isLoading={activeTab === 'departures' ? departuresQuery.isLoading : arrivalsQuery.isLoading}
            flights={(activeTab === 'departures' ? departuresQuery.data : arrivalsQuery.data) ?? []}
          />
        </section>
      )}
    </div>
  );
}

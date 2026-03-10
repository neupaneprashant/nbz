import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { FlightOffer, FlightSearchParams } from '../../types/flight.types';
import SaveToTripModal from './SaveToTripModal';

export default function FlightOfferCard({
  offer,
  passengers,
  searchParams,
}: {
  offer: FlightOffer;
  passengers: number;
  searchParams: FlightSearchParams;
}) {
  const { isAuthenticated } = useAuth();
  const [showSaveModal, setShowSaveModal] = useState(false);

  const firstSegment = offer.itineraries[0]?.segments[0];
  const depTime = firstSegment?.departure?.time ? new Date(firstSegment.departure.time) : null;
  const isUpcoming = depTime ? depTime >= new Date() : false;
  const trackFlightCode = firstSegment ? `${firstSegment.carrier}${firstSegment.flightNumber}` : '';

  return (
    <article className="rounded-xl border bg-white p-4 shadow">
      <div className="grid gap-4 md:grid-cols-[1fr_2fr_1fr] md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
              {offer.airline.slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold">{offer.airlineName}</p>
              <p className="text-xs text-slate-500">{offer.airline}</p>
            </div>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Flight {offer.itineraries[0]?.segments[0]?.flightNumber}
          </p>
        </div>

        <div className="space-y-3">
          {offer.itineraries.map((itin, idx) => {
            const first = itin.segments[0];
            const last = itin.segments[itin.segments.length - 1];
            return (
              <div key={`${offer.id}-${idx}`} className="text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {new Date(first?.departure?.time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    {first?.departure?.airport}
                  </span>
                  <span className="text-xs text-slate-500">
                    {itin.stops === 0 ? 'Direct' : `${itin.stops} Stop${itin.stops > 1 ? 's' : ''}`}
                  </span>
                  <span className="font-semibold">
                    {new Date(last?.arrival?.time).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}{' '}
                    {last?.arrival?.airport}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Duration: {itin.duration}</p>
              </div>
            );
          })}
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold">
            {offer.price.currency} {offer.price.total}
          </p>
          {passengers > 1 && (
            <p className="text-xs text-slate-500">
              {offer.price.currency} {offer.price.perPerson} per person
            </p>
          )}
          {offer.seats <= 5 && (
            <p className="mt-1 text-xs text-amber-600">⚠️ Only {offer.seats} seats left</p>
          )}
          <div className="mt-2 flex justify-end gap-2">
            <button className="rounded bg-sky-600 px-3 py-1 text-sm text-white">Select</button>
            {isAuthenticated && (
              <button
                className="rounded border px-3 py-1 text-sm"
                onClick={() => setShowSaveModal(true)}
              >
                🗺️ Save to Trip
              </button>
            )}
          </div>
          {isUpcoming && trackFlightCode && (
            <Link
              to={`/flights/status?flight=${trackFlightCode}`}
              className="mt-2 inline-block text-xs text-sky-600 underline"
            >
              Track Status
            </Link>
          )}
          <p className="mt-1 text-xs text-slate-500">Ticket by {offer.lastTicketingDate}</p>
        </div>
      </div>

      {showSaveModal && (
        <SaveToTripModal
          offer={offer}
          searchParams={searchParams}
          onClose={() => setShowSaveModal(false)}
        />
      )}
    </article>
  );
}

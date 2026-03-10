export const MOCK_FLIGHT_OFFERS = [
  {
    id: 'MOCK1',
    validatingAirlineCodes: ['BA'],
    price: { total: '540.00', currency: 'USD', base: '270.00' },
    itineraries: [
      {
        duration: 'PT8H30M',
        segments: [
          {
            departure: { iataCode: 'JFK', at: '2026-04-10T08:00:00' },
            arrival: { iataCode: 'LHR', at: '2026-04-10T20:30:00' },
            carrierCode: 'BA',
            number: '178',
            duration: 'PT8H30M',
          },
        ],
      },
    ],
    numberOfBookableSeats: 6,
    lastTicketingDate: '2026-04-01',
  },
  {
    id: 'MOCK2',
    validatingAirlineCodes: ['AA'],
    price: { total: '620.00', currency: 'USD', base: '310.00' },
    itineraries: [
      {
        duration: 'PT9H20M',
        segments: [
          {
            departure: { iataCode: 'JFK', at: '2026-04-10T10:00:00' },
            arrival: { iataCode: 'LHR', at: '2026-04-10T23:20:00' },
            carrierCode: 'AA',
            number: '100',
            duration: 'PT9H20M',
          },
        ],
      },
    ],
    numberOfBookableSeats: 4,
    lastTicketingDate: '2026-04-02',
  },
  {
    id: 'MOCK3',
    validatingAirlineCodes: ['DL'],
    price: { total: '700.00', currency: 'USD', base: '350.00' },
    itineraries: [
      {
        duration: 'PT10H10M',
        segments: [
          {
            departure: { iataCode: 'JFK', at: '2026-04-10T12:30:00' },
            arrival: { iataCode: 'CDG', at: '2026-04-11T02:40:00' },
            carrierCode: 'DL',
            number: '444',
            duration: 'PT7H10M',
          },
          {
            departure: { iataCode: 'CDG', at: '2026-04-11T04:00:00' },
            arrival: { iataCode: 'LHR', at: '2026-04-11T05:30:00' },
            carrierCode: 'AF',
            number: '1880',
            duration: 'PT1H30M',
          },
        ],
      },
    ],
    numberOfBookableSeats: 9,
    lastTicketingDate: '2026-04-03',
  },
];

/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { AmadeusService } from './amadeus/amadeus.service';
import type {
  Airport,
  FlightOffer,
  FlightSearchResult,
} from './types/flight-offer.interface';
import { AviationstackService } from './aviationstack/aviationstack.service';
import type {
  FlightStatus,
  FlightStatusResult,
} from './aviationstack/flight-status.interface';
import { MOCK_FLIGHT_STATUS } from './mock-data/mock-status';

@Injectable()
export class FlightsService {
  private readonly airportCache = new Map<string, Airport[]>();
  private readonly logger = new Logger(FlightsService.name);

  constructor(
    private readonly amadeusService: AmadeusService,
    private readonly aviationstackService: AviationstackService,
    private readonly prisma: PrismaService,
  ) {}

  private formatDuration(isoDuration: string): string {
    const match = isoDuration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?$/);
    if (!match) return isoDuration;
    const hours = match[1] ? `${match[1]}h` : '';
    const minutes = match[2] ? `${match[2]}m` : '';
    return [hours, minutes].filter(Boolean).join(' ').trim();
  }

  private validateIata(code: string, label: string) {
    if (!/^[A-Z]{3}$/i.test(code)) {
      throw new BadRequestException(`${label} must be a 3-letter IATA code`);
    }
  }

  async searchFlights(
    dto: SearchFlightsDto,
    userId?: string,
  ): Promise<FlightSearchResult> {
    const departure = new Date(dto.departureDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (departure < today) {
      throw new BadRequestException('Departure date cannot be in the past');
    }

    const response = await this.amadeusService.searchFlights(dto);
    const carriers = response?.dictionaries?.carriers ?? {};

    const transformedOffers: FlightOffer[] = (response.data ?? []).map(
      (offer: any) => ({
        id: offer.id,
        airline: offer.validatingAirlineCodes?.[0] ?? 'N/A',
        airlineName:
          carriers?.[offer.validatingAirlineCodes?.[0]] ??
          offer.validatingAirlineCodes?.[0] ??
          'Unknown Airline',
        price: {
          total: offer.price?.total,
          currency: offer.price?.currency,
          perPerson: offer.price?.base,
        },
        itineraries: (offer.itineraries ?? []).map((itin: any) => ({
          duration: this.formatDuration(itin.duration),
          stops: (itin.segments?.length ?? 1) - 1,
          segments: (itin.segments ?? []).map((seg: any) => ({
            departure: {
              airport: seg.departure?.iataCode,
              time: seg.departure?.at,
            },
            arrival: {
              airport: seg.arrival?.iataCode,
              time: seg.arrival?.at,
            },
            carrier: seg.carrierCode,
            flightNumber: seg.number,
            duration: this.formatDuration(seg.duration),
          })),
        })),
        seats: offer.numberOfBookableSeats,
        lastTicketingDate: offer.lastTicketingDate,
      }),
    );

    void this.prisma.flightSearchLog
      .create({
        data: {
          userId: userId ?? null,
          origin: dto.origin,
          destination: dto.destination,
          departureDate: new Date(dto.departureDate),
          returnDate: dto.returnDate ? new Date(dto.returnDate) : null,
          passengers: dto.passengers,
        },
      })
      .catch(() => undefined);

    return {
      origin: dto.origin,
      destination: dto.destination,
      departureDate: dto.departureDate,
      returnDate: dto.returnDate,
      passengers: dto.passengers,
      results: transformedOffers,
      totalResults: transformedOffers.length,
    };
  }

  async getUserSearchHistory(userId: string) {
    return this.prisma.flightSearchLog.findMany({
      where: { userId },
      orderBy: { searchedAt: 'desc' },
      take: 10,
    });
  }

  async searchAirports(keyword: string): Promise<Airport[]> {
    const cacheKey = keyword.toLowerCase().trim();
    if (this.airportCache.has(cacheKey)) {
      return this.airportCache.get(cacheKey) as Airport[];
    }

    const response = await this.amadeusService.searchAirports(keyword);
    const airports: Airport[] = (response?.data ?? []).map((airport: any) => ({
      iataCode: airport.iataCode,
      name: airport.name,
      cityName: airport.address?.cityName,
      countryCode: airport.address?.countryCode,
      countryName: airport.address?.countryCode,
    }));

    this.airportCache.set(cacheKey, airports);
    return airports;
  }

  async getFlightStatus(flightNumber: string): Promise<FlightStatusResult> {
    const normalized = flightNumber.toUpperCase().replace(/\s+/g, '');
    if (!/^[A-Z]{2}\d{1,4}$/i.test(normalized)) {
      throw new BadRequestException(
        'Invalid flight number format. Example: BA123',
      );
    }

    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    let results: FlightStatus[];
    if (!apiKey) {
      this.logger.warn(
        'AVIATIONSTACK_API_KEY not configured, returning mock data',
      );
      results = MOCK_FLIGHT_STATUS.map((s) => ({
        ...s,
        flightNumber: normalized,
      }));
    } else {
      results = await this.aviationstackService.getFlightStatus(normalized);
    }

    return {
      flightNumber: normalized,
      results,
      lastUpdated: new Date().toISOString(),
    };
  }

  async getFlightsByRoute(
    origin: string,
    destination: string,
  ): Promise<FlightStatus[]> {
    this.validateIata(origin, 'Origin');
    this.validateIata(destination, 'Destination');

    const apiKey = process.env.AVIATIONSTACK_API_KEY;
    if (!apiKey) {
      this.logger.warn(
        'AVIATIONSTACK_API_KEY not configured, returning mock data',
      );
      return MOCK_FLIGHT_STATUS;
    }

    return this.aviationstackService.getFlightsByRoute(
      origin.toUpperCase(),
      destination.toUpperCase(),
    );
  }

  async getDepartures(airportCode: string): Promise<FlightStatus[]> {
    this.validateIata(airportCode, 'Airport code');
    if (!process.env.AVIATIONSTACK_API_KEY) return MOCK_FLIGHT_STATUS;
    return this.aviationstackService.getAirportFlights(
      airportCode.toUpperCase(),
      'departures',
    );
  }

  async getArrivals(airportCode: string): Promise<FlightStatus[]> {
    this.validateIata(airportCode, 'Airport code');
    if (!process.env.AVIATIONSTACK_API_KEY) return MOCK_FLIGHT_STATUS;
    return this.aviationstackService.getAirportFlights(
      airportCode.toUpperCase(),
      'arrivals',
    );
  }
}

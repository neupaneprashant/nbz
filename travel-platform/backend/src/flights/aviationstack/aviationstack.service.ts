/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import type { FlightStatus } from './flight-status.interface';

@Injectable()
export class AviationstackService {
  private readonly baseUrl = 'https://api.aviationstack.com/v1';
  private readonly apiKey: string;
  private cache: Map<string, { data: FlightStatus[]; expiry: Date }> =
    new Map();
  private readonly CACHE_TTL_MS = 60000;

  constructor(private readonly configService: ConfigService) {
    this.apiKey = this.configService.get<string>('aviationstack.apiKey') ?? '';
  }

  private getCached(key: string): FlightStatus[] | null {
    const item = this.cache.get(key);
    if (item && item.expiry > new Date()) {
      return item.data;
    }
    return null;
  }

  private setCache(key: string, data: FlightStatus[]): void {
    this.cache.set(key, {
      data,
      expiry: new Date(Date.now() + this.CACHE_TTL_MS),
    });
  }

  async getFlightStatus(flightNumber: string): Promise<FlightStatus[]> {
    const normalized = flightNumber.toUpperCase().replace(/\s+/g, '');
    const cached = this.getCached(normalized);
    if (cached) return cached;

    const response = await axios.get(`${this.baseUrl}/flights`, {
      params: { access_key: this.apiKey, flight_iata: normalized, limit: 5 },
    });

    const rows = response.data?.data ?? [];
    if (rows.length === 0) {
      throw new NotFoundException(`Flight not found: ${normalized}`);
    }

    const data = rows.map((r: any) => this.transformFlight(r));
    this.setCache(normalized, data);
    return data;
  }

  async getFlightsByRoute(
    origin: string,
    destination: string,
  ): Promise<FlightStatus[]> {
    const response = await axios.get(`${this.baseUrl}/flights`, {
      params: {
        access_key: this.apiKey,
        dep_iata: origin,
        arr_iata: destination,
        limit: 10,
      },
    });
    return (response.data?.data ?? []).map((r: any) => this.transformFlight(r));
  }

  async getAirportFlights(
    airportCode: string,
    type: 'departures' | 'arrivals',
  ): Promise<FlightStatus[]> {
    const response = await axios.get(`${this.baseUrl}/flights`, {
      params: {
        access_key: this.apiKey,
        dep_iata: type === 'departures' ? airportCode : undefined,
        arr_iata: type === 'arrivals' ? airportCode : undefined,
        flight_status: 'active',
        limit: 20,
      },
    });

    return (response.data?.data ?? []).map((r: any) => this.transformFlight(r));
  }

  private transformFlight(raw: any): FlightStatus {
    return {
      flightDate: raw.flight_date,
      flightNumber: raw.flight?.iata || raw.flight?.icao || 'UNKNOWN',
      status: raw.flight_status || 'unknown',
      departure: {
        airport: raw.departure?.airport,
        iataCode: raw.departure?.iata,
        scheduled: raw.departure?.scheduled,
        estimated: raw.departure?.estimated,
        actual: raw.departure?.actual,
        delay: raw.departure?.delay,
        terminal: raw.departure?.terminal,
        gate: raw.departure?.gate,
      },
      arrival: {
        airport: raw.arrival?.airport,
        iataCode: raw.arrival?.iata,
        scheduled: raw.arrival?.scheduled,
        estimated: raw.arrival?.estimated,
        actual: raw.arrival?.actual,
        delay: raw.arrival?.delay,
        terminal: raw.arrival?.terminal,
        gate: raw.arrival?.gate,
        baggage: raw.arrival?.baggage,
      },
      airline: {
        name: raw.airline?.name,
        iataCode: raw.airline?.iata,
      },
      aircraft: raw.aircraft
        ? {
            registration: raw.aircraft?.registration,
            iataCode: raw.aircraft?.iata,
            model: raw.aircraft?.iata,
          }
        : null,
    };
  }
}

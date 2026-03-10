/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
import {
  BadRequestException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosError } from 'axios';
import { MOCK_FLIGHT_OFFERS } from '../mock-data/mock-flights';
import type { FlightSearchParams } from './flight-search.params';

@Injectable()
export class AmadeusService {
  private readonly logger = new Logger(AmadeusService.name);
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private readonly baseUrl = 'https://test.api.amadeus.com';

  constructor(private readonly configService: ConfigService) {}

  private hasApiKeys(): boolean {
    return Boolean(
      this.configService.get<string>('amadeus.apiKey') &&
      this.configService.get<string>('amadeus.apiSecret'),
    );
  }

  private async getAccessToken(): Promise<string> {
    if (!this.hasApiKeys()) {
      throw new ServiceUnavailableException('Amadeus API not configured');
    }

    if (this.accessToken && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.accessToken;
    }

    try {
      const params = new URLSearchParams();
      params.set('grant_type', 'client_credentials');
      params.set(
        'client_id',
        this.configService.get<string>('amadeus.apiKey') ?? '',
      );
      params.set(
        'client_secret',
        this.configService.get<string>('amadeus.apiSecret') ?? '',
      );

      const response = await axios.post(
        `${this.baseUrl}/v1/security/oauth2/token`,
        params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        },
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
      return this.accessToken as string;
    } catch {
      throw new ServiceUnavailableException('Flight service unavailable');
    }
  }

  async searchFlights(params: FlightSearchParams): Promise<any> {
    if (!this.hasApiKeys()) {
      this.logger.warn('Amadeus API not configured, returning mock data');
      return {
        data: MOCK_FLIGHT_OFFERS,
        dictionaries: {
          carriers: {
            BA: 'British Airways',
            AA: 'American Airlines',
            DL: 'Delta Air Lines',
            AF: 'Air France',
          },
        },
      };
    }

    const execute = async () => {
      const token = await this.getAccessToken();
      return axios.get(`${this.baseUrl}/v2/shopping/flight-offers`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          originLocationCode: params.origin,
          destinationLocationCode: params.destination,
          departureDate: params.departureDate,
          returnDate: params.returnDate,
          adults: params.passengers,
          max: 10,
          currencyCode: 'USD',
        },
      });
    };

    try {
      const response = await execute();
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      if (axiosError.response?.status === 401) {
        this.accessToken = null;
        this.tokenExpiry = null;
        const retry = await execute();
        return retry.data;
      }

      const message =
        axiosError.response?.data?.errors?.[0]?.detail ||
        axiosError.response?.data?.message ||
        'Unable to search flights';

      throw new BadRequestException(message);
    }
  }

  async getFlightPrice(_offerId: string, offer: any): Promise<any> {
    if (!this.hasApiKeys()) {
      return {
        data: {
          type: 'flight-offers-pricing',
          flightOffers: [offer],
        },
      };
    }

    const token = await this.getAccessToken();
    const response = await axios.post(
      `${this.baseUrl}/v1/shopping/flight-offers/pricing`,
      {
        data: {
          type: 'flight-offers-pricing',
          flightOffers: [offer],
        },
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    return response.data;
  }

  async searchAirports(keyword: string): Promise<any> {
    if (!this.hasApiKeys()) {
      return {
        data: [
          {
            iataCode: 'JFK',
            name: 'John F Kennedy International Airport',
            address: { cityName: 'New York', countryCode: 'US' },
          },
          {
            iataCode: 'LHR',
            name: 'Heathrow Airport',
            address: { cityName: 'London', countryCode: 'GB' },
          },
        ].filter((a) =>
          `${a.iataCode} ${a.name}`
            .toLowerCase()
            .includes(keyword.toLowerCase()),
        ),
      };
    }

    const token = await this.getAccessToken();
    const response = await axios.get(
      `${this.baseUrl}/v1/reference-data/locations`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          keyword,
          subType: 'AIRPORT',
          'page[limit]': 10,
        },
      },
    );

    return response.data;
  }
}

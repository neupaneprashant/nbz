import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { AirportSearchDto } from './dto/airport-search.dto';
import { SearchFlightsDto } from './dto/search-flights.dto';
import { FlightsService } from './flights.service';
import { RouteQueryDto } from './dto/route-query.dto';

@Controller('flights')
export class FlightsController {
  constructor(private readonly flightsService: FlightsService) {}

  @Public()
  @Post('search')
  searchFlights(@Body() dto: SearchFlightsDto, @GetUser('id') userId?: string) {
    return this.flightsService.searchFlights(dto, userId);
  }

  @Get('search/history')
  getUserSearchHistory(@GetUser('id') userId: string) {
    return this.flightsService.getUserSearchHistory(userId);
  }

  @Public()
  @Get('airports')
  searchAirports(@Query() query: AirportSearchDto) {
    return this.flightsService.searchAirports(query.keyword);
  }

  @Public()
  @Get('status/:flightNumber')
  getFlightStatus(@Param('flightNumber') flightNumber: string) {
    return this.flightsService.getFlightStatus(flightNumber);
  }

  @Public()
  @Get('route')
  getFlightsByRoute(@Query() query: RouteQueryDto) {
    return this.flightsService.getFlightsByRoute(
      query.origin,
      query.destination,
    );
  }

  @Public()
  @Get('departures/:airportCode')
  getDepartures(@Param('airportCode') airportCode: string) {
    return this.flightsService.getDepartures(airportCode);
  }

  @Public()
  @Get('arrivals/:airportCode')
  getArrivals(@Param('airportCode') airportCode: string) {
    return this.flightsService.getArrivals(airportCode);
  }
}

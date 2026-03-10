import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CreateTripDto } from './dto/create-trip.dto';
import { CreateTripItemDto } from './dto/create-trip-item.dto';
import { ReorderItemsDto } from './dto/reorder-items.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { UpdateTripItemDto } from './dto/update-trip-item.dto';
import { TripsService } from './trips.service';

@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Get()
  getUserTrips(@GetUser('id') userId: string) {
    return this.tripsService.getUserTrips(userId);
  }

  @Post()
  createTrip(@GetUser('id') userId: string, @Body() dto: CreateTripDto) {
    return this.tripsService.createTrip(userId, dto);
  }

  @Get(':id')
  getTripById(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tripsService.getTripById(id, userId);
  }

  @Patch(':id')
  updateTrip(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: UpdateTripDto,
  ) {
    return this.tripsService.updateTrip(id, userId, dto);
  }

  @Delete(':id')
  deleteTrip(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.tripsService.deleteTrip(id, userId);
  }

  @Post(':id/items')
  addTripItem(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: CreateTripItemDto,
  ) {
    return this.tripsService.addTripItem(id, userId, dto);
  }

  @Patch(':id/items/:itemId')
  updateTripItem(
    @Param('itemId') itemId: string,
    @GetUser('id') userId: string,
    @Body() dto: UpdateTripItemDto,
  ) {
    return this.tripsService.updateTripItem(itemId, userId, dto);
  }

  @Delete(':id/items/:itemId')
  deleteTripItem(
    @Param('itemId') itemId: string,
    @GetUser('id') userId: string,
  ) {
    return this.tripsService.deleteTripItem(itemId, userId);
  }

  @Patch(':id/items/reorder')
  reorderTripItems(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: ReorderItemsDto,
  ) {
    return this.tripsService.reorderTripItems(id, userId, dto.items);
  }

  @Public()
  @Get(':id/public')
  getTripPublic(@Param('id') id: string) {
    return this.tripsService.getTripPublic(id);
  }
}

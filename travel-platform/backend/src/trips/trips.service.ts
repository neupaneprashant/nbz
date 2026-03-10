import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { CreateTripItemDto } from './dto/create-trip-item.dto';
import { UpdateTripItemDto } from './dto/update-trip-item.dto';

@Injectable()
export class TripsService {
  constructor(private readonly prisma: PrismaService) {}

  getUserTrips(userId: string) {
    return this.prisma.trip.findMany({
      where: { userId },
      include: {
        destination: {
          select: { id: true, name: true, country: true, imageUrl: true },
        },
        _count: { select: { tripItems: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTripById(tripId: string, userId: string) {
    const trip = await this.prisma.trip.findFirst({
      where: { id: tripId, userId },
      include: {
        destination: true,
        tripItems: { orderBy: [{ dayNumber: 'asc' }, { startTime: 'asc' }] },
      },
    });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }

  createTrip(userId: string, dto: CreateTripDto) {
    return this.prisma.trip.create({
      data: {
        ...dto,
        userId,
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
      },
      include: { destination: true },
    });
  }

  async updateTrip(tripId: string, userId: string, dto: UpdateTripDto) {
    await this.getTripById(tripId, userId);
    return this.prisma.trip.update({
      where: { id: tripId },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async deleteTrip(tripId: string, userId: string) {
    await this.getTripById(tripId, userId);
    await this.prisma.trip.delete({ where: { id: tripId } });
  }

  async addTripItem(tripId: string, userId: string, dto: CreateTripItemDto) {
    await this.getTripById(tripId, userId);
    return this.prisma.tripItem.create({ data: { ...dto, tripId } });
  }

  async updateTripItem(itemId: string, userId: string, dto: UpdateTripItemDto) {
    const item = await this.prisma.tripItem.findUnique({
      where: { id: itemId },
      include: { trip: true },
    });
    if (!item || item.trip.userId !== userId) {
      throw new NotFoundException('Trip item not found');
    }

    return this.prisma.tripItem.update({ where: { id: itemId }, data: dto });
  }

  async deleteTripItem(itemId: string, userId: string) {
    const item = await this.prisma.tripItem.findUnique({
      where: { id: itemId },
      include: { trip: true },
    });
    if (!item || item.trip.userId !== userId) {
      throw new NotFoundException('Trip item not found');
    }

    await this.prisma.tripItem.delete({ where: { id: itemId } });
  }

  async reorderTripItems(
    tripId: string,
    userId: string,
    items: Array<{ id: string; dayNumber: number; startTime?: string }>,
  ) {
    await this.getTripById(tripId, userId);
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.tripItem.update({
          where: { id: item.id },
          data: { dayNumber: item.dayNumber, startTime: item.startTime },
        }),
      ),
    );
  }

  async getTripPublic(tripId: string) {
    const trip = await this.prisma.trip.findUnique({
      where: { id: tripId },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        status: true,
        destination: { select: { name: true, country: true, imageUrl: true } },
        tripItems: {
          select: {
            itemType: true,
            title: true,
            description: true,
            dayNumber: true,
            startTime: true,
            endTime: true,
            location: true,
            cost: true,
            currency: true,
          },
          orderBy: [{ dayNumber: 'asc' }, { startTime: 'asc' }],
        },
      },
    });
    if (!trip) throw new NotFoundException('Trip not found');
    return trip;
  }
}

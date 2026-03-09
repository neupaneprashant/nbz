import { Injectable, NotFoundException } from '@nestjs/common';
import { Destination } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';

@Injectable()
export class DestinationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filters?: { country?: string; featured?: boolean }): Promise<Destination[]> {
    return this.prisma.destination.findMany({
      where: {
        country: filters?.country
          ? { contains: filters.country, mode: 'insensitive' }
          : undefined,
        featured: filters?.featured ?? undefined,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Destination> {
    const destination = await this.prisma.destination.findUnique({ where: { id } });
    if (!destination) {
      throw new NotFoundException('Destination not found');
    }

    return destination;
  }

  create(dto: CreateDestinationDto): Promise<Destination> {
    return this.prisma.destination.create({ data: dto });
  }

  async update(id: string, dto: UpdateDestinationDto): Promise<Destination> {
    await this.findById(id);
    return this.prisma.destination.update({ where: { id }, data: dto });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.destination.delete({ where: { id } });
  }

  getFeatured(): Promise<Destination[]> {
    return this.prisma.destination.findMany({ where: { featured: true }, take: 6 });
  }
}

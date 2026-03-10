import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { AmadeusModule } from './amadeus/amadeus.module';
import { AviationstackModule } from './aviationstack/aviationstack.module';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';

@Module({
  imports: [PrismaModule, AmadeusModule, AviationstackModule, ConfigModule],
  controllers: [FlightsController],
  providers: [FlightsService],
})
export class FlightsModule {}

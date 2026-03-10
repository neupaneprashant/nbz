import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AviationstackService } from './aviationstack.service';

@Module({
  imports: [ConfigModule],
  providers: [AviationstackService],
  exports: [AviationstackService],
})
export class AviationstackModule {}

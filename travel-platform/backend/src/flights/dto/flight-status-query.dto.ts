import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class FlightStatusQueryDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Z]{2}\d{1,4}$/i)
  flightNumber!: string;
}

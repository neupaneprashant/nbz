import { IsString, MinLength } from 'class-validator';

export class AirportSearchDto {
  @IsString()
  @MinLength(2)
  keyword!: string;
}

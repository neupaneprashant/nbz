import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  Min,
} from 'class-validator';

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export class SearchFlightsDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  @Transform(({ value }) => String(value).toUpperCase())
  origin!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  @Transform(({ value }) => String(value).toUpperCase())
  destination!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(DATE_REGEX)
  departureDate!: string;

  @IsOptional()
  @IsString()
  @Matches(DATE_REGEX)
  returnDate?: string;

  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsInt()
  @Min(1)
  @Max(9)
  passengers = 1;
}

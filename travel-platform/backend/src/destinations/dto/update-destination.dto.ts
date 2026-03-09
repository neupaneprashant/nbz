import { IsBoolean, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateDestinationDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  bestSeason?: string;

  @IsOptional()
  @IsNumber()
  averageBudget?: number;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}

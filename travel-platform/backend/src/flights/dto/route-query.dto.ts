import { IsString, Length, Matches } from 'class-validator';

export class RouteQueryDto {
  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  origin!: string;

  @IsString()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/)
  destination!: string;
}

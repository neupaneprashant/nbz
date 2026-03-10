import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class ReorderItem {
  @IsString()
  id!: string;

  @IsInt()
  @Min(1)
  dayNumber!: number;

  @IsOptional()
  @IsString()
  startTime?: string;
}

export class ReorderItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReorderItem)
  items!: ReorderItem[];
}

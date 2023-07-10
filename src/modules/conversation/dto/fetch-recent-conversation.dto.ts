import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class FetchRecentDto {
  @IsString()
  search?: string;

  @IsNotEmpty()
  @IsNumber()
  page: number;
}

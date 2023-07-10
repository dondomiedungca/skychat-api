import { IsNotEmpty, IsString, IsNumber, IsArray } from 'class-validator';

export class FetchConversationsDto {
  @IsNotEmpty()
  @IsString()
  type: 'personal' | 'group';

  @IsString()
  search?: string;

  @IsNotEmpty()
  @IsNumber()
  page: number;

  @IsNotEmpty()
  @IsArray()
  parties: string[];
}

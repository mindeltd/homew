import { IsNotEmpty, IsString } from 'class-validator';

export class QueryDataDto {
  @IsString()
  @IsNotEmpty()
  ticker: string;

  @IsString()
  @IsNotEmpty()
  column: string;

  @IsString()
  @IsNotEmpty()
  table: string;
}
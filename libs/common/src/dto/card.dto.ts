import { Type } from 'class-transformer';
import { IsCreditCard, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class Carddto {
  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsNumber()
  exp_month: number;

  @IsNumber()
  @Type(() => Number)
  exp_year: number;

  @IsCreditCard()
  number: string;
}

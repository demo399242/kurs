
import { IsString, IsNumberString, IsBoolean, IsOptional, ValidateNested, IsNumber } from 'class-validator';

export class DeleteShopDto {

  @IsNumber()
  shopId: number;

}

export interface IDeleteShop {
  shopId: number;
}






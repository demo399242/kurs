import { IsString, IsNumberString, IsBoolean, IsOptional, ValidateNested, IsNumber } from 'class-validator';

export class PayShopDto {

  @IsNumber()
  shopId: number;

  @IsNumber()
  monthes: number;

}

export interface IPayShop {
  shopId: number;
  monthes: number;
}






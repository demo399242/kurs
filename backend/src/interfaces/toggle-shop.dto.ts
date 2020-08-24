import { IsString, IsNumberString, IsBoolean, IsOptional, ValidateNested, IsNumber } from 'class-validator';

export class ToggleShopDto {

  @IsNumber()
  shopId: number;

  @IsBoolean()
  value: boolean;

}

export interface IToggleShop {
  shopId: number;
  value: boolean;
}






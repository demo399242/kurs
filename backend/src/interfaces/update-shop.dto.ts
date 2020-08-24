import { IsString, IsNumberString, IsBoolean, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer'
import { CreateShopDto, ICreateShop } from './create-shop.dto';

export class UpdateShopDto extends CreateShopDto {

  @IsNumber()
  id: number;

}

export interface IUpdateShop extends ICreateShop {
  id: number;
}
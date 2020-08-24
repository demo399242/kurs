import { IsString, IsNumberString, IsBoolean, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer'

class WorkingDay {

  @IsString()
  day: string;

  @IsBoolean()
  active: boolean;

  @IsString()
  from: string;

  @IsString()
  till: string;

}

class FeaturesDto {

  @IsBoolean()
  "24/7": boolean;

  @IsBoolean()
  guard: boolean;

  @IsBoolean()
  gold: boolean;

}

export class CreateShopDto {

  @IsString()
  name: string;

  @IsString()
  street: string;

  @IsString()
  house: string;

  @IsNumber()
  cityId: number;

  @ValidateNested({ each: true })
  @Type(() => FeaturesDto)
  features: FeaturesDto;

  @ValidateNested({ each: true })
  @Type(() => WorkingDay)
  workingdays: WorkingDay[];

}

export interface ICreateShop {
  name: string;
  street: string;
  house: string;
  cityId: number;
  features: any;
  workingdays: any;
}






import { IsString, IsNumberString } from 'class-validator';

export class SetProfileField {

  @IsString()
  field: string;

  @IsString()
  value: string;

}

export interface IProfileField {
  field: string;
  value: string;
}


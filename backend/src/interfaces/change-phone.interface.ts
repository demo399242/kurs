import { IsString, IsNumberString } from 'class-validator';

export class ChangePhoneDto {

  @IsString()
  smsCodeId: string;

}

export interface IChangePhone {
  smsCodeId: string;
}


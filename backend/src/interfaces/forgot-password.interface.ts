import { IsString, IsNumberString } from 'class-validator';

export class ForgotPasswordDto {

  @IsString()
  password: string;

  @IsString()
  smsCodeId: string;

}

export interface IForgotPassword {
  password: string;
  smsCodeId: string;
}


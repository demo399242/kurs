import { IsString, IsNumberString } from 'class-validator';

export class SignupUserDto {
  
  @IsNumberString()
  phone: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsString()
  type: string;

  @IsNumberString()
  iin: string;

  @IsString()
  smsCodeId: string;

}

export interface ISignupUser {
  phone: string;
  password: string;
  name: string;
  type: string;
  iin: string;
  smsCodeId: string;
}

export interface ISignupUserResult {
  token: string;
}

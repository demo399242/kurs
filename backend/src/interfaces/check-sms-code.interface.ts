import { IsString, IsNumberString, IsBoolean, IsOptional } from 'class-validator';

export class CheckSmsCodeDto {

  @IsNumberString()
  phone: string;

  @IsString()
  smsCodeId: string;

  @IsNumberString()
  code: string;

  @IsString()
  origin: string;
}

export interface ICheckSmsCode {
  smsCodeId: string;
  phone: string;
  origin: string;
  code: string;
}

export interface ICheckSmsCodeResult {
  success: boolean;
  chances: number;
}

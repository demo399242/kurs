import { IsString, IsNumberString, IsBoolean, IsOptional } from 'class-validator';
import { SmsCodeOrigin } from '../database/entities/smscode.entity';

export const expiredMinutes = 10

export class SendSmsCodeDto {
  
  @IsNumberString()
  phone: string;

  @IsString()
  origin: SmsCodeOrigin;

  @IsOptional()
  @IsString()
  captcha: string;

  @IsOptional()
  @IsBoolean()
  sendAgain: boolean;

}

export interface ISendSmsCode {
  phone: string;
  origin: SmsCodeOrigin;
  captcha?: string;
  sendAgain?: boolean;
}

export interface ISendSmsCodeResult {
  smsCodeId: string;
}
import { IsString, IsNumberString } from 'class-validator';

export class LoginUserDto {
  
  @IsNumberString()
  phone: string;

  @IsString()
  password: string;

}

export interface ILoginUser {
  phone: string;
  password: string;
}

export interface ILoginUserResult {
  token: string;
}

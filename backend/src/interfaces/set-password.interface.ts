import { IsString, IsNumberString } from 'class-validator';

export class SetPasswordDto {

  @IsString()
  password: string;

  @IsString()
  newPassword: string;

}

export interface ISetPassword {
  password: string;
  newPassword: string;
}


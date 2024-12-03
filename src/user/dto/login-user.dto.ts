/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsString()
  identifire: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

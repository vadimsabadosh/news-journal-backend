import { IsEmail, Length } from 'class-validator';

export class LoginUserDto {
  @IsEmail(undefined, { message: 'Wrong email' })
  email: string;

  @Length(6, 32, { message: 'Minimun length is 6 characters' })
  password: string;
}

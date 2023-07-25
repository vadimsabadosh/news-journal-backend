import { IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @Length(2)
  firstName: string;

  @Length(2)
  lastName: string;

  @IsEmail(undefined, {
    message: 'Email is invalid',
  })
  email: string;

  @Length(6, 20, { message: 'Minimum length is 6 characters' })
  password: string;
}

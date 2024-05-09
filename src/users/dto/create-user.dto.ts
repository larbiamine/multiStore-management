// create-user.dto.ts

import { Optional } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  readonly email: string;



  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string;


  // @IsNotEmpty({ message: 'StoreId is required' })
  @Optional()
  storeId: string;
  @Optional()
  type: UserType;
  @Optional()
  firstname: UserType;
  @Optional()
  lastname: UserType;
}

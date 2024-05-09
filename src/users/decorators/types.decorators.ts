
import { SetMetadata } from '@nestjs/common';
import { UserType } from '@prisma/client';
// import { UserType } from '../enums/user-type.enum';

export const USER_TYPES_KEY = 'userTypes';
export const TypeUser = (...userTypes: UserType[]) => SetMetadata(USER_TYPES_KEY, userTypes);

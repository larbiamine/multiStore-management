import { Prisma } from '@prisma/client';

export type ReturnedUser = Omit<Prisma.UserCreateInput, 'password'>;

export type LoginUser = {
    email: string;
    password: string;
}
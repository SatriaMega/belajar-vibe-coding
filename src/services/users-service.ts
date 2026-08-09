import { db } from '../db';
import { users } from '../schema/users';
import { eq } from 'drizzle-orm';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class UserAlreadyExistsError extends Error {
  constructor() {
    super('email sudah terdaftar');
    this.name = 'UserAlreadyExistsError';
  }
}

export const usersService = {
  async registerUser(input: RegisterUserInput) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = await Bun.password.hash(input.password, {
      algorithm: 'bcrypt',
      cost: 10,
    });

    await db.insert(users).values({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    });

    return { data: 'OK' as const };
  },
};

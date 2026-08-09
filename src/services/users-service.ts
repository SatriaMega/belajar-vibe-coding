import { db } from '../db';
import { users } from '../schema/users';
import { sessions } from '../schema/sessions';
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

export interface LoginUserInput {
  email: string;
  password: string;
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('email atau password salah');
    this.name = 'InvalidCredentialsError';
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

  async loginUser(input: LoginUserInput) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1);

    if (existingUser.length === 0) {
      throw new InvalidCredentialsError();
    }

    const user = existingUser[0];
    const isPasswordValid = await Bun.password.verify(input.password, user.password);

    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    const token = crypto.randomUUID();

    await db.insert(sessions).values({
      token,
      userId: user.id,
    });

    return { data: token };
  },
};

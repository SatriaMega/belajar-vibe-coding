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

export class UnauthorizedError extends Error {
  constructor() {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
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

  async getCurrentUser(token: string) {
    if (!token) {
      throw new UnauthorizedError();
    }
    // Find session
    const sessionResult = await db
      .select()
      .from(sessions)
      .where(eq(sessions.token, token))
      .limit(1);
    if (sessionResult.length === 0) {
      throw new UnauthorizedError();
    }
    const session = sessionResult[0];
    // Find user
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1);
    if (userResult.length === 0) {
      throw new UnauthorizedError();
    }
    const user = userResult[0];
    const { password, ...rest } = user; // exclude password
    return { data: rest };
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

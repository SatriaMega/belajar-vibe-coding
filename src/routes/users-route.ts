import { Elysia, t } from 'elysia';
import { usersService, UserAlreadyExistsError } from '../services/users-service';

export const usersRoute = new Elysia({ prefix: '/api/users' })
  .post(
    '/',
    async ({ body, set }) => {
      try {
        const result = await usersService.registerUser(body);
        set.status = 200;
        return result;
      } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
          set.status = 400;
          return { error: error.message };
        }
        set.status = 500;
        return { error: 'Internal Server Error' };
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ minLength: 1 }),
        password: t.String({ minLength: 1 }),
      }),
    }
  );

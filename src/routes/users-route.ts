import { Elysia, t } from 'elysia';
import { usersService, UserAlreadyExistsError, InvalidCredentialsError, UnauthorizedError } from '../services/users-service';

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
  )
  .post(
    '/login',
    async ({ body, set }) => {
      try {
        const result = await usersService.loginUser(body);
        set.status = 200;
        return result;
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          set.status = 400;
          return { error: error.message };
        }
        set.status = 500;
        return { error: 'Internal Server Error' };
      }
    },
    {
      body: t.Object({
        email: t.String({ minLength: 1 }),
        password: t.String({ minLength: 1 }),
      }),
    }
  .get(
    '/current',
    async ({ request, set }) => {
      try {
        const authHeader = request.headers.get('authorization') || '';
        const token = authHeader.split(' ')[1] || '';
        const result = await usersService.getCurrentUser(token);
        set.status = 200;
        return result;
      } catch (error) {
        if (error instanceof UnauthorizedError) {
          set.status = 401;
          return { error: error.message };
        }
        set.status = 500;
        return { error: 'Internal Server Error' };
      }
    },
    {
      // No body schema required for GET
    }
  );

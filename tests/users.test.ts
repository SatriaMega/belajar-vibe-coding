import { describe, expect, it, mock } from 'bun:test';
import { usersRoute } from '../src/routes/users-route';
import { usersService, UserAlreadyExistsError } from '../src/services/users-service';

describe('User Registration Route', () => {
  it('should return 200 and { data: "OK" } on successful registration', async () => {
    mock.module('../src/services/users-service', () => ({
      usersService: {
        registerUser: async () => ({ data: 'OK' as const }),
      },
      UserAlreadyExistsError,
    }));

    const response = await usersRoute.handle(
      new Request('http://localhost/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Eko',
          email: 'eko@localhost',
          password: 'rahasia',
        }),
      })
    );

    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json).toEqual({ data: 'OK' });
  });

  it('should return 400 and { error: "email sudah terdaftar" } when email already exists', async () => {
    mock.module('../src/services/users-service', () => ({
      usersService: {
        registerUser: async () => {
          throw new UserAlreadyExistsError();
        },
      },
      UserAlreadyExistsError,
    }));

    const response = await usersRoute.handle(
      new Request('http://localhost/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Eko',
          email: 'eko@localhost',
          password: 'rahasia',
        }),
      })
    );

    expect(response.status).toBe(400);
    const json = await response.json();
    expect(json).toEqual({ error: 'email sudah terdaftar' });
  });
});

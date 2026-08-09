import { Elysia } from 'elysia';

export const healthRoutes = new Elysia({ prefix: '/ping' })
  .get('/', () => ({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  }));

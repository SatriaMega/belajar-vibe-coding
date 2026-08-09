import { Elysia } from 'elysia';
import { healthRoutes } from './routes/health';
import { usersRoute } from './routes/users-route';

const port = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .use(healthRoutes)
  .use(usersRoute)
  .get('/', () => ({
    message: 'Welcome to Belajar Vibe Coding API!',
    docs: '/ping',
  }))
  .listen(port);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);

export type App = typeof app;

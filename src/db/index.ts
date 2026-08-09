import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as usersSchema from '../schema/users';
import * as sessionsSchema from '../schema/sessions';

const schema = { ...usersSchema, ...sessionsSchema };

const connectionString = process.env.DATABASE_URL || 'mysql://root:password@localhost:3306/belajar_vibe_coding';

export const poolConnection = mysql.createPool(connectionString);
export const db = drizzle({ client: poolConnection, schema, mode: 'default' });

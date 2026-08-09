# Project Setup: Bun, ElysiaJS, Drizzle, and MySQL

## Goal
Initialize a new backend project using Bun as the runtime, ElysiaJS as the web framework, and Drizzle ORM to connect to a MySQL database.

## Instructions
Please implement the following high-level tasks to set up the foundation of the project.

### 1. Project Initialization
- Initialize a new Bun project in the root directory.
- Ensure `package.json` and basic configuration files (`tsconfig.json` if needed) are present.

### 2. Dependencies
- Install the core dependencies:
  - `elysia` (for the web framework)
  - `drizzle-orm` (for the ORM)
  - `mysql2` (MySQL driver)
- Install the development dependencies:
  - `drizzle-kit` (for managing migrations)
  - Any necessary types.

### 3. Folder Structure
- Establish a modular folder structure. A recommended approach:
  - `src/` - Main source folder
  - `src/db/` - Database connection and config
  - `src/schema/` - Drizzle database schemas
  - `src/routes/` - API route definitions

### 4. Database Configuration (Drizzle & MySQL)
- Configure the MySQL connection using Drizzle within the `src/db/` directory.
- Create a `drizzle.config.ts` file at the root level for Drizzle Kit.
- Create a basic schema (e.g., a simple `users` table) to verify the ORM setup.
- Rely on environment variables (e.g., `.env`) for database connection strings.

### 5. Elysia App Initialization
- Create the main entry point (e.g., `src/index.ts`).
- Initialize the Elysia application.
- Add a basic health-check route (e.g., `GET /ping`).
- Start the server on a default port (e.g., 3000).

### 6. NPM / Bun Scripts
- Add convenience scripts to `package.json` for:
  - Starting the development server (`bun run dev`).
  - Running database migrations via Drizzle Kit.

## Acceptance Criteria
- Running the development script starts the Elysia server without errors.
- The project has a clear structure ready for further feature development.
- The database connection code is present and configured to use MySQL and Drizzle.

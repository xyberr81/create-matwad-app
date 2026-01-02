// Load environment variables
try {
  process.loadEnvFile(".env.local");
} catch (err) {}

export const development = {
  client: "pg",
  connection: {
    connectionString: process.env.SUPABASE_DB_URL,
    // just in case
    ssl: {
      rejectUnauthorized: false,
    },
  },
  pool: {
    min: 0,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};

export const staging = {
  client: "pg",
  connection: {
    connectionString: process.env.SUPABASE_DB_URL,
    // just in case
    ssl: {
      rejectUnauthorized: false,
    },
  },
  pool: {
    min: 0,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};

export const production = {
  client: "pg",
  connection: {
    connectionString: process.env.SUPABASE_DB_URL,
    // just in case
    ssl: {
      rejectUnauthorized: false,
    },
  },
  pool: {
    min: 0,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
  },
  seeds: {
    directory: "./seeds",
  },
};

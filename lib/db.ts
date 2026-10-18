import { Pool, QueryResult, QueryResultRow } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var pgPool: Pool | undefined;
}

const connectionString =
  process.env.DATABASE_URL ||
  `postgresql://${process.env.PGUSER || "postgres"}:${encodeURIComponent(
    process.env.PGPASSWORD || ""
  )}@${process.env.PGHOST || "localhost"}:${process.env.PGPORT || 5432}/${
    process.env.PGDATABASE || "unsaid"
  }?sslmode=disable`;

export const pool: Pool =
  global.pgPool ||
  new Pool({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

if (process.env.NODE_ENV !== "production") {
  global.pgPool = pool;
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> {
  return pool.query<T>(text, params);
}

export async function connectDB() {
  return pool;
}

export default connectDB;

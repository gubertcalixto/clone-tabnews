import database from "infra/database";
import { ServiceError } from "infra/errors";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

async function listPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const pendingMigrations = await migrationRunner({
      dbClient: dbClient,
      dir: resolve("infra", "migrations"),
      migrationsTable: "pgmigrations",
      dryRun: true,
      log: () => {},
      direction: "up",
    });
    return pendingMigrations;
  } catch (error) {
    throw new ServiceError({
      message: "Error trying to get pending migrations",
      cause: error,
    });
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;
  try {
    dbClient = await database.getNewClient();
    const migrationsApplied = await migrationRunner({
      dbClient: dbClient,
      dir: resolve("infra", "migrations"),
      migrationsTable: "pgmigrations",
      dryRun: false,
      log: () => {},
      direction: "up",
    });
    return migrationsApplied;
  } catch (error) {
    throw new ServiceError({
      message: "Error trying to run migrations",
      cause: error,
    });
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;

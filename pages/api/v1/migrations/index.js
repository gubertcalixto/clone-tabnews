import { createRouter } from "next-connect";
import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import { onNoMatchHandler, onErrorHandler } from "infra/errors";

const router = createRouter();
router.get(migrationsHandler).post(migrationsHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

async function migrationsHandler(request, response) {
  const dryRun = request.method === "GET";
  const dbClient = await database.getNewClient();

  try {
    const migrationsApplied = await migrationRunner({
      dbClient: dbClient,
      dir: resolve("infra", "migrations"),
      migrationsTable: "pgmigrations",
      dryRun,
      direction: "up",
    });
    const responseStatus =
      !dryRun && Boolean(migrationsApplied.length) ? 201 : 200;
    return response.status(responseStatus).json(migrationsApplied);
  } finally {
    await dbClient.end();
  }
}

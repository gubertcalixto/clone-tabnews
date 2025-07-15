import { createRouter } from "next-connect";
import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import controller from "infra/controller";

const router = createRouter();
router.get(getHandler).post(postHandler);
export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const dbClient = await database.getNewClient();

  try {
    const migrationsApplied = await migrationRunner({
      dbClient: dbClient,
      dir: resolve("infra", "migrations"),
      migrationsTable: "pgmigrations",
      dryRun: true,
      direction: "up",
    });
    return response.status(200).json(migrationsApplied);
  } finally {
    await dbClient.end();
  }
}

async function postHandler(request, response) {
  const dbClient = await database.getNewClient();

  try {
    const migrationsApplied = await migrationRunner({
      dbClient: dbClient,
      dir: resolve("infra", "migrations"),
      migrationsTable: "pgmigrations",
      dryRun: false,
      direction: "up",
    });
    const responseStatus = migrationsApplied.length ? 201 : 200;
    return response.status(responseStatus).json(migrationsApplied);
  } finally {
    await dbClient.end();
  }
}

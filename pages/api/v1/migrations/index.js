import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";

async function migrations(request, response) {
  if (!["GET", "POST"].includes(request.method)) {
    return response.status(405).json({
      error: `Method "${request.method}" not allow`,
    });
  }

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

export default migrations;

import database from 'infra/database';
import migrationRunner from 'node-pg-migrate';
import { join } from 'node:path';

async function migrations(request, response) {
  if (!['GET', 'POST'].includes(request.method)) {
    return response.status(405).end();
  }
  const dryRun = request.method === 'GET';
  const dbClient = await database.getNewClient();

  const migrationsApplied = await migrationRunner({
    dbClient: dbClient,
    dir: join('infra', 'migrations'),
    migrationsTable: 'pgmigrations',
    dryRun,
    direction: 'up'
  });

  await dbClient.end();

  const responseStatus = !dryRun && Boolean(migrationsApplied.length) ? 201 : 200;

  return response.status(responseStatus).json(migrationsApplied);
}

export default migrations;

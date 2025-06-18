import migrationRunner from 'node-pg-migrate'
import { join } from 'node:path';

async function migrations(request, response) {
  if (!['GET', 'POST'].includes(request.method)) {
    return response.status(405).end();
  }
  const dryRun = request.method === 'GET';
  const migrations = await migrationRunner({
    databaseUrl: process.env.DATABASE_URL,
    dir: join('infra', 'migrations'),
    migrationsTable: 'pgmigrations',
    dryRun,
    direction: 'up'
  });
 
  response.status(200).json(migrations);
}

export default migrations;

import controller from "infra/controller";
import migrator from "models/migrator";
import { createRouter } from "next-connect";

const router = createRouter();
router.get(getHandler).post(postHandler);
export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const migrations = await migrator.listPendingMigrations();
  return response.status(200).json(migrations);
}

async function postHandler(request, response) {
  const appliedMigrations = await migrator.runPendingMigrations();
  const responseStatus = appliedMigrations.length ? 201 : 200;
  return response.status(responseStatus).json(appliedMigrations);
}

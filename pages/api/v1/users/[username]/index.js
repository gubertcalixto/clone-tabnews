import controller from "infra/controller";
import { createRouter } from "next-connect";
import user from "models/user";

const router = createRouter();
router.get(getHandler);
export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const userName = request.query.username;
  const userFound = await user.findOneByUserName(userName);
  return response.status(200).json(userFound);
}

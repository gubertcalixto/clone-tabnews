import controller from "infra/controller";
import { createRouter } from "next-connect";
import user from "models/user";

const router = createRouter();
router.post(postHandler);
export default router.handler(controller.errorHandlers);

async function postHandler(request, response) {
  const userInput = request.body;
  const createdUser = await user.create(userInput);
  return response.status(201).json(createdUser);
}

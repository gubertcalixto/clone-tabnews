require("dotenv").config({ path: ".env.development" });
import orchestrator from "tests/orchestrator";
import { version as getUUIDVersion } from "uuid";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("GET /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("with exact case match", async () => {
      const userName = "user-one";
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          email: `${userName}@email.com`,
          password: "passw0rd!",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${userName}`,
      );
      expect(response2.status).toBe(200);

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        id: response2Body.id,
        username: userName,
        email: `${userName}@email.com`,
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      expect(getUUIDVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });

    test("with case mismatch", async () => {
      const userName = "user-two";
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: userName,
          email: `${userName}@email.com`,
          password: "passw0rd!",
        }),
      });
      expect(response.status).toBe(201);

      const response2 = await fetch(
        `http://localhost:3000/api/v1/users/${userName.toUpperCase()}`,
      );
      expect(response2.status).toBe(200);

      const response2Body = await response2.json();
      expect(response2Body).toEqual({
        id: response2Body.id,
        username: userName,
        email: `${userName}@email.com`,
        password: response2Body.password,
        created_at: response2Body.created_at,
        updated_at: response2Body.updated_at,
      });

      expect(getUUIDVersion(response2Body.id)).toBe(4);
      expect(Date.parse(response2Body.created_at)).not.toBeNaN();
      expect(Date.parse(response2Body.updated_at)).not.toBeNaN();
    });

    test("with nonexistent user", async () => {
      const userName = "user-three";

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${userName.toUpperCase()}`,
      );
      expect(response.status).toBe(404);

      const responseBody = await response.json();
      expect(responseBody).toEqual({
        name: "NotFoundError",
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
        status_code: 404,
      });
    });
  });
});

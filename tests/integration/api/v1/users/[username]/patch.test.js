require("dotenv").config({ path: ".env.development" });
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe("PATCH /api/v1/users/[username]", () => {
  describe("Anonymous user", () => {
    test("with nonexistent username", async () => {
      const userName = "user-unknown";

      const response = await fetch(
        `http://localhost:3000/api/v1/users/${userName}`,
        {
          method: 'PATCH'
        }
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

    test("with duplicate 'username'", async () => {
      // Creating user 1
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          email: "user1@email.com",
          password: "passw0rd!",
        }),
      });
      expect(user1Response.status).toBe(201);
      
      // Creating user 2
      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
          email: "user2@email.com",
          password: "passw0rd!",
        }),
      });
      expect(user2Response.status).toBe(201);

      // Patching user 2
      const patchResponse = await fetch("http://localhost:3000/api/v1/users/user2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
        }),
      });
      expect(patchResponse.status).toBe(400);
      const patchResponseBody = await patchResponse.json();
      expect(patchResponseBody).toEqual({
        name: "ValidationError",
        message: "O username informado já está sendo utilizado.",
        action: "Utilize outro username para realizar essa operação.",
        status_code: 400,
      });
    });
    
    test("with duplicate 'email'", async () => {
      // Creating user 1
      const user1Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email1",
          email: "email1@email.com",
          password: "passw0rd!",
        }),
      });
      expect(user1Response.status).toBe(201);
      
      // Creating user 2
      const user2Response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "email2",
          email: "email2@email.com",
          password: "passw0rd!",
        }),
      });
      expect(user2Response.status).toBe(201);

      // Patching user 2
      const patchResponse = await fetch("http://localhost:3000/api/v1/users/email2", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "email1@email.com",
        }),
      });
      expect(patchResponse.status).toBe(400);
      const patchResponseBody = await patchResponse.json();
      expect(patchResponseBody).toEqual({
        name: "ValidationError",
        message: "O email informado já está sendo utilizado.",
        action: "Utilize outro email para realizar essa operação.",
        status_code: 400,
      });
    });
  });
});

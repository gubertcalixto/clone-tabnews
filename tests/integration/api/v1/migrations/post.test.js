require("dotenv").config({ path: ".env.development" });
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("running pending migrations", () => {
      test("for the first time", async () => {
        // First migration call, it must return all aplied migrations
        const response = await fetch(
          "http://localhost:3000/api/v1/migrations",
          {
            method: "POST",
          },
        );
        expect(response.status).toBe(201);
        const responseBody = await response.json();
        expect(Array.isArray(responseBody)).toBe(true);
        expect(responseBody.length).toBeGreaterThan(0);
      });

      test("for the second time", async () => {
        // Second migration call, it must return an empty migrations aplied list
        const secondResponse = await fetch(
          "http://localhost:3000/api/v1/migrations",
          { method: "POST" },
        );
        expect(secondResponse.status).toBe(200);
        const secondResponseBody = await secondResponse.json();
        expect(Array.isArray(secondResponseBody)).toBe(true);
        expect(secondResponseBody.length).toBe(0);
      });
    });
  });
});

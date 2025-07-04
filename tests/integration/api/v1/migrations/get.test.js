require("dotenv").config({ path: ".env.development" });
import database from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await cleanDatabase();
});

async function cleanDatabase() {
  await database.query(
    "DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public",
  );
}
describe("GET /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    test("getting pending migrations", async () => {
      const response = await fetch("http://localhost:3000/api/v1/migrations");
      expect(response.status).toBe(200);

      const responseBody = await response.json();
      expect(Array.isArray(responseBody)).toBe(true);
      expect(responseBody.length).toBeGreaterThan(0);
    });
  });
});

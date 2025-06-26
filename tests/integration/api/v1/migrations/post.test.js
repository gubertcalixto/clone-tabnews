require('dotenv').config({ path: '.env.development' });
import database from 'infra/database';
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
    await orchestrator.waitForAllServices();
    await cleanDatabase();
});

async function cleanDatabase() {
    await database.query('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public');
}

test('POST to /api/v1/migrations should return 200', async () => {
    // First migration call, it must return all aplied migrations
    const response = await fetch('http://localhost:3000/api/v1/migrations', { method: 'POST' });
    expect(response.status).toBe(201);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);
    
    // Second migration call, it must return an empty migrations aplied list
    const secondResponse = await fetch('http://localhost:3000/api/v1/migrations', { method: 'POST' });
    expect(secondResponse.status).toBe(200);
    const secondResponseBody = await secondResponse.json();
    expect(Array.isArray(secondResponseBody)).toBe(true);
    expect(secondResponseBody.length).toBe(0);
});
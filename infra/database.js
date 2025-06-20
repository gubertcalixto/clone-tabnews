import { Client } from 'pg';

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSlValues()
  });
  await client.connect();
  return client;
}

async function query(queryObject) {
  let wasConnectionStablished = false;
  let client;
  try {
    client = await getNewClient();
    wasConnectionStablished = true;
    const res = await client.query(queryObject);
    return res;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
  finally {
    if (wasConnectionStablished) {
      await client.end();
    }
  }
}

function getSSlValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA
    };
  }
  return !['development', 'test'].includes(process.env.NODE_ENV);
}

export default {
  query,
  getNewClient
};

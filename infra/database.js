import { Client } from 'pg';

async function query(queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSlValues()
  });
  let wasConnectionStablished = false;
  try {
    await client.connect();
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
  return process.env.NODE_ENV !== 'development';
}

export default {
  query: query
};

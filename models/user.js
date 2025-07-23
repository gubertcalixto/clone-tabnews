import database from "infra/database";

async function create(userdata) {
  const results = await database.query({
    text: `
    INSERT INTO
        users (username, email, password)
    VALUES
        ($1, $2, $3)
    RETURNING *;`,
    values: [userdata.username, userdata.email, userdata.password],
  });

  return results.rows[0];
}

const user = {
  create,
};

export default user;

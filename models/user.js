import database from "infra/database";
import { ValidationError, NotFoundError } from "infra/errors";

async function create(userdata) {
  await validateUniqueness(userdata.email, userdata.username);
  const newUser = await runInsertQuery(userdata);
  return newUser;

  async function runInsertQuery(userdata) {
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

  async function validateUniqueness(email, username) {
    const normalizedEmail = String(email).toLowerCase();
    const normalizedUsername = String(username).toLowerCase();
    const results = await database.query({
      text: `
      SELECT LOWER(email) as email, LOWER(username) as username FROM users where LOWER(email) = $1 OR LOWER(username) = $2 LIMIT 1
    `,
      values: [normalizedEmail, normalizedUsername],
    });

    if (results.rowCount > 0) {
      const duplicatedField =
        String(results.rows[0].email) === normalizedEmail
          ? "email"
          : "username";
      throw new ValidationError({
        message: `O ${duplicatedField} informado já está sendo utilizado.`,
        action: `Utilize outro ${duplicatedField} para realizar o cadastro.`,
      });
    }
  }
}

async function findOneByUserName(username) {
  return await runSelectQuery();

  async function runSelectQuery() {
    const results = await database.query({
      text: `
    SELECT * FROM
        users
    WHERE
        LOWER(username) = $1
    LIMIT 1;`,
      values: [String(username).toLowerCase()],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "O username informado não foi encontrado no sistema.",
        action: "Verifique se o username está digitado corretamente.",
      });
    }

    return results.rows[0];
  }
}

const user = {
  create,
  findOneByUserName,
};

export default user;

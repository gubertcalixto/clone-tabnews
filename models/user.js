import database from "infra/database";
import password from "models/password";
import { ValidationError, NotFoundError } from "infra/errors";

async function create(userdata) {
  await validateUniqueUsername(userdata.username);
  await validateUniqueEmail(userdata.email);
  await hashPasswordInObject(userdata);

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
}

async function update(username, userData) {
  const currentUser = await findOneByUserName(username);

  if ("username" in userData) {
    await validateUniqueUsername(userData.username);
  }
  if ("email" in userData) {
    await validateUniqueEmail(userData.email);
  }
  if ("password" in userData) {
    await hashPasswordInObject(userData);
  }

  const userWithNewValues = { ...currentUser, ...userData };
  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: `
    UPDATE
      users
    SET 
      username = $2,
      email = $3,
      password = $4,
      updated_at = timezone('utc', now())
    WHERE id = $1
    RETURNING *;`,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });

    return results.rows[0];
  }
}

async function hashPasswordInObject(userdata) {
  const hashedPassword = await password.hash(userdata.password);
  userdata.password = hashedPassword;
}

async function validateUniqueEmail(email) {
  const normalizedEmail = String(email).toLowerCase();
  const results = await database.query({
    text: `
    SELECT LOWER(email) as email, LOWER(username) as username FROM users where LOWER(email) = $1 LIMIT 1
  `,
    values: [normalizedEmail],
  });

  if (results.rowCount > 0) {
    const duplicatedField = "email";
    throw new ValidationError({
      message: `O ${duplicatedField} informado já está sendo utilizado.`,
      action: `Utilize outro ${duplicatedField} para realizar essa operação.`,
    });
  }
}

async function validateUniqueUsername(username) {
  const normalizedUsername = String(username).toLowerCase();
  const results = await database.query({
    text: `
    SELECT LOWER(username) as username FROM users where LOWER(username) = $1 LIMIT 1
  `,
    values: [normalizedUsername],
  });

  if (results.rowCount > 0) {
    const duplicatedField = "username";
    throw new ValidationError({
      message: `O ${duplicatedField} informado já está sendo utilizado.`,
      action: `Utilize outro ${duplicatedField} para realizar essa operação.`,
    });
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
  update,
  findOneByUserName,
};

export default user;

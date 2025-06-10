import database from '../../../../infra/database.js'


async function status(request, response) {
  const _ = await database.query('SELECT 1;');
  response.status(200).json({ key: "value" });
}

export default status;

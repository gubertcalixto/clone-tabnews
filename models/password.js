import bcryptjs from "bcryptjs";

const getNumberOfRounds = () =>
  process.env.NODE_ENV === "production" ? 14 : 1;

async function hash(userPassword) {
  const passwordPlusPepper = addPepperToPassword(userPassword);
  return await bcryptjs.hash(passwordPlusPepper, getNumberOfRounds());
}

function addPepperToPassword(password) {
  if (!process.env.BCRYPT_PEPPER) {
    // If no pepper is provided, it is okay
    return password;
  }
  return password + process.env.BCRYPT_PEPPER;
}

async function compare(providedPassword, storedHash) {
  const providedPasswordPlusPepper = addPepperToPassword(providedPassword);
  return await bcryptjs.compare(providedPasswordPlusPepper, storedHash);
}

const password = {
  hash,
  compare,
};

export default password;

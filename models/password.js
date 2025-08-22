import bcryptjs from "bcryptjs";

const getNumberOfRounds = () => process.env.NODE_ENV === 'production' ? 14 : 1;

async function hash(userPassword) {
    return await bcryptjs.hash(userPassword, getNumberOfRounds());
}

async function compare(passwordToValidate, storedHash) {
    return await bcryptjs.compare(passwordToValidate, storedHash);
}

const password = {
  hash,
  compare
};

export default password;

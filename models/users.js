const { User } = require("../db/usersModel");
const bcrypt = require("bcrypt");

const signup = async (email, password) => {
  try {
    const user = new User({ email, password: await bcrypt.hash(password, 10) });
    await user.save();
  } catch (error) {
    console.log(error);
  }
};

const login = async () => {};

module.exports = {
  signup,
  login,
};

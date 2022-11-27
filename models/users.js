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

const login = async (email, password) => {
  const user = await User.findOne({ email });

  if (await bcrypt.compare(password, user.password)) {
    throw new Error(`wrong error`);
  }
};

module.exports = {
  signup,
  login,
};

const { Conflict} = require('http-errors')
const { User } = require("../db/usersModel");
const bcrypt = require("bcrypt");

const signup = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) { 
    throw Conflict
  }
  try {
    const newUser = new User({ email, password: await bcrypt.hash(password, 10) });
    await newUser.save();
  } catch (error) {
    console.log(error);
  }
};

const login = async (email, password) => {
  
};
const logout = async () => {

};

module.exports = {
  signup,
  login,
  logout
};

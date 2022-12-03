const createError = require('http-errors')
const { User } = require("../db/usersModel");
const bcrypt = require("bcrypt");

const signup = async (email, password) => {
  
    const user = await User.findOne({ email });
    if (user) {
      throw createError(409, 'Email in use.', {status: "Conflict"})
    }
      const newUser = new User ({ email, password: await bcrypt.hash(password, 10) });
      await newUser.save();
  }

const login = async (email, password) => {
  
};
const logout = async () => {

};

module.exports = {
  signup,
  login,
  logout
};

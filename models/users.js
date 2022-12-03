const createError = require('http-errors')
const { User } = require("../db/usersModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
require("dotenv").config();
const secret = process.env.SECRET_KEY;

const signup = async (email, password) => {
  
    const user = await User.findOne({ email });
    if (user) {
      throw createError(409, "Email in use", {status: "Conflict"})
    }
      const newUser = new User ({ email, password: await bcrypt.hash(password, 10) });
      await newUser.save();
  }

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, "Email or password is wrong", {status: "Unauthorized"})
  }
  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw createError(401, "Email or password is wrong", {status: "Unauthorized"}) 
  }
  const payload = {
    id: user._id,
  }
  const token = jwt.sign(payload, secret, { expiresIn: "1h" })
  await User.updateOne({ email }, {token})
  return {
    token,
    subscription: user.subscription
  }


};

const logout = async () => {

};

const getCurrent = async () => { 

}

module.exports = {
  signup,
  login,
  logout,
  getCurrent
};

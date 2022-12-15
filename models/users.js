const createError = require('http-errors')
const { User } = require("../db/usersModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar')
const sgMail = require('@sendgrid/mail')
const { v4: uuidv4 } = require('uuid');
sgMail.setApiKey(process.env.SENDGRID_API_KEY)


require("dotenv").config();
const secret = process.env.SECRET_KEY;

const signup = async (email, password) => {
  
    const user = await User.findOne({ email });
    if (user) {
      throw createError(409, "Email in use", {status: "Conflict"})
  }
  
  const avatarURL = gravatar.url(email);
  const newVerifyToken = uuidv4();
      const newUser = new User ({ email, password: await bcrypt.hash(password, 10), avatarURL, verificationToken: newVerifyToken});
  await newUser.save();
  const msg = {
  to: email, 
  from: 'shtankoandrew90@gmail.com',
  subject: 'Thanks for your registration',
  text: `Thanks for your registration in our APP. For verify your account go to http://localhost:3000/api/users/verify/${newVerifyToken}`,
  html: `<strong>Thanks for your registration in our APP. For verify your account go to <a href="http://localhost:3000/api/users/verify/${newVerifyToken}">Confirm your email</a></strong>`,
}
  await sgMail.send(msg);
  }

const login = async (email, password) => {
  const user = await User.findOne({ email, verify: true });
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

const logout = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw createError(401, "Not authorized", {status: "Unauthorized"})
  }
  await User.findByIdAndUpdate(id, { token: null });

};

const updateAvatar = async (id, avatarPath) => { 
  const user = await User.findById(id);
  if (!user) { 
    throw createError(401, "Not authorized", {status: "Unauthorized"})
  }
  await User.findByIdAndUpdate(id, {avatarURL: avatarPath})
}

const verify = async (verificationToken) => {
  const isVerify = await User.findOne(verificationToken);
  if (!isVerify) {
    throw createError(404, "User not found", {status: "Not found"})
  }
  await User.updateOne({ verificationToken }, {verificationToken: null, verify: true})
}

const reVerification = async (email) => { 
  const user = User.findOne({ email, verify: false });
  if (!user) {
    throw createError(400, "Verification has already been passed", {status: "Bad Request"})
  }
  const msg = {
  to: email, 
  from: 'shtankoandrew90@gmail.com',
  subject: 'Thanks for your registration',
  text: `Thanks for your registration in our APP. For verify your account go to http://localhost:3000/api/users/verify/${user.verificationToken}`,
  html: `<strong>Thanks for your registration in our APP. For verify your account go to <a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Confirm your email</a></strong>`,
}
  await sgMail.send(msg);
}


module.exports = {
  signup,
  login,
  logout,
  updateAvatar,
  verify,
  reVerification
};

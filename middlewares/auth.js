const createError = require('http-errors')
const jwt = require('jsonwebtoken');
require("dotenv").config();
const secret = process.env.SECRET_KEY;
const { User } = require('../db/usersModel');


const auth = async (req, res, next) => {
    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");
    try {
        if (bearer !== "Bearer") {
            throw createError(401, "Not authorized", { status: "Unauthorized" })
        }
        const { id } = jwt.verify(token, secret);
        const user = await User.findById(id);
        if (!user || !user.token) {
            throw createError(401, "Not authorized", {status: "Unauthorized"})
        }
        req.user = user;
        next()
    } catch (error) {
        if (error.message === "Invalid signature") { 
            error.status = 401;
        }
        next(error)
    }

}
 
module.exports = {
    auth
}
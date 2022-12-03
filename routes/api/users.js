const express = require("express");
const Joi = require("joi");
const { signup, login } = require("../../models/users");
const router = express.Router();

const userSingupSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  subscription: Joi.string(),
  token:Joi.string()
});

const userLoginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required()
})

router.post("/signup", async (req, res, next) => {
  const { error} = userSingupSchema.validate(req.body)
  const { email, password } = req.body;
  if (error) {
    return res.status(400).json({
      status: "Bad Request",
      ResponseBody: {
        message: "missing some input fields"
      }
    })
  }
  try {
    await signup(email, password);
    res.status(201).json({
    status: "Created",
    ResponseBody: {
      user: {
        email: email,
        subscription: "starter",
      },
    },
  });
  } catch (error) {
    next(error)
  }
  
});
router.post("/login", async (req, res, next) => { 
  const { error } = userLoginSchema.validate(req.body)
  const { email, password } = req.body;
  if (error) {
    return res.status(400).json({
      status: "Bad Request",
      ResponseBody: {
        message: "missing some input fields"
      }
    })
  }
  try {
    await login(email, password)
    res.status(200).json({
      Status:  "OK",
      ResponseBody: {
      token: "exampletoken",
      user: {
      email: email,
      subscription: "starter"
  }
}
    })
  } catch (error) {
    next(error)
  }
});
router.post("/logout")

module.exports = router;

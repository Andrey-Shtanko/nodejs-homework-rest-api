const express = require("express");
const { signup } = require("../../models/users");
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
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
});
router.post("/login");

module.exports = router;

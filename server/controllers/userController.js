const User = require("../models/userModel");
const asynchHandler = require("express-async-handler");

const createUser = asynchHandler(async (req, res) => {
  const email = req.body.email;

  const findUser = await User.findOne({ email });
  if (!findUser) {
    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("User already Exists");
  }
});

// const login

module.exports = { createUser };

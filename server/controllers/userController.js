const User = require("../models/userModel");
const asynchHandler = require("express-async-handler");
const generateToken = require("../config/jwtToken");

// !@Function:   register a new user
// !@Method:     POST
// !@Route:      api/user/register
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

// !@Function:    login user
// !@Method:      POST
// !@Route:       api/user/login
const loginUser = asynchHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    res.json({
      _id: findUser?._id,
      firstName: findUser?.firstname,
      lastName: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

// !@Function:    get all users
// !@Method:      GET
// !@Route:       /api/user/all-users
const getAllUser = asynchHandler(async (req, res) => {
  try {
    const getUsers = await User.find();
    res.json(getUsers);
  } catch (error) {
    throw new Error(error);
  }
});

// !@Function:    get a single user
// !@Method:      GET
// !@Route:       /api/user/:id
const getaUser = asynchHandler(async (req, res) => {
  const { id } = req.params;
  try {
    getUser = await User.findById(id);
    res.json({ getUser });
  } catch (error) {
    throw new Error(error);
  }
});

// !@Function:    delete user
// !@Method:      DELETE
// !@Route:       /api/user/:id
const deleteaUser = asynchHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({ deleteUser });
  } catch (error) {
    throw new Error(error);
  }
});

// !@Function:    update user
// !@Method:      UPDATE
// !@Route:       /api/user/:id
const updateaUser = asynchHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body?.firstname,
        lasttname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      { new: true }
    );

    res.json({ updatedUser });
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getaUser,
  deleteaUser,
  updateaUser,
};

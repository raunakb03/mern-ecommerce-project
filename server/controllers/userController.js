const User = require("../models/userModel");
const asynchHandler = require("express-async-handler");
const generateToken = require("../config/jwtToken");
const validateMongodbId = require("../utils/validateMongodbId");
const generateRefreshToken = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const sendMail = require("./emailController");
const crypto = require("crypto");

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
    const refreshToken = await generateRefreshToken(findUser?.id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      { refreshToken: refreshToken },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
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

// !Function:   handle refresh token
// !@Method:    GET
// !Route:      /api/user/refresh
const handleRefreshToken = asynchHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh Token");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error("No refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?.id);
    res.json({ accessToken });
  });
});

// !Function:   logout functionality
// !@Method:    GET
// !Route:      /api/user/logout
const logout = asynchHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No refresh Token");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true });
    return res.sendStatus(204); // forbidden
  }

  await User.findOneAndUpdate(refreshToken, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", { httpOnly: true, secure: true });
  return res.sendStatus(204); // forbidden
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
  validateMongodbId(id);
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
  validateMongodbId(id);
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
  const { id } = req.user;
  validateMongodbId(id);
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

// !@Function:    block user
// !@Method:      UPDATE
// !@Route:       /api/user/:block-user/d
const blockUser = asynchHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      { new: true }
    );
    res.json({
      msg: "User blocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// !@Function:    unblock user
// !@Method:      UPDATE
// !@Route:       /api/user/unblock-uer/:id
const unblockUser = asynchHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      { new: true }
    );
    res.json({
      msg: "User Unblocked",
    });
  } catch (error) {
    throw new Error(error);
  }
});

// !@Function:    update password
// !@Method:      PUT
// !@Route:       /api/user/password
const updatePassword = asynchHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  }
  else {
    res.json(user);
  }
})

// !@Function:    create forgot password token
// !@Method:      PUT
// !@Route:       /api/user/forgot-password-token
const forgotPassawordToken = asynchHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("Email does not exists");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset your password. This link is valid till 10 minutes from now. <a href="http://localhost:5000/api/user/reset-password/${token}">Click here<a/>`
    const data = {
      to: email,
      text: "Hey user",
      subject: "Reset password link",
      htm: resetURL
    }
    sendMail(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});

// !@Function:    reset password
// !@Method:      PUT
// !@Route:       /api/user/reset-password
const resetPassword = asynchHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash('sha256').update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token expired. Please try agian later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
})

module.exports = {
  createUser,
  loginUser,
  getAllUser,
  getaUser,
  deleteaUser,
  updateaUser,
  blockUser,
  unblockUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPassawordToken,
  resetPassword,
};

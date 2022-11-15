const User = require(`../models/userModel`);
const { connection } = require("../config/db");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandler");

//Regiter User
exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, mobile, password } = req.body;
  const user = await User.create({
    name,
    email,
    mobile,
    password,
    avatar: {
      public_id: "public",
      url: "url for avatar",
    },
  });

  connection.query(
    "insert into user values(default , ? , ? ,? ,?)",
    [name, email, mobile, password],
    (error, data) => {
      if (error) throw error;
    }
  );

  sendToken(user, 201, res);
});

//Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { mobile, password } = req.body;

  if (!mobile || !password) {
    return next(new ErrorHandler("Please enter mobile and password", 400));
  }

  const user = await User.findOne({ mobile }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid mobile or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid mobile or password", 401));
  }

  sendToken(user, 200, res);
});

//Logout User
exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out Successfully.",
  });
});

// get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// update password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched)
    return next(new ErrorHandler("Old password is incorrect", 400));

  if (req.body.newPassword !== req.body.confirmPassword)
    return next(new ErrorHandler("Password does not match.", 400));

  if (req.body.oldPassword == req.body.newPassword) {
    return next(
      new ErrorHandler(
        "New password must be diff. from previous password.",
        400
      )
    );
  }

  user.password = req.body.newPassword;

  await user.save();

  connection.query(
    "update user set password=? where mobile=?",
    [req.body.newPassword, user.mobile],
    (err, data) => {
      if (err) throw err;
    }
  );

  sendToken(user, 200, res);
});

//update user profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email, avatar } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, email, avatar },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// get all Users (only Admin accessible api)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// get single user ( only admin accessible api)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id -: ${req.params.id}`, 401)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// update user role (only admin accessible api)
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id -: ${req.params.id}`, 401)
    );
  }

  user.role = "admin";

  await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated successfully.",
  });
});

//delete user (only admin accessible api)
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`user does not exist with id -: ${req.params.id}`, 401)
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User deleted successfully.",
  });
});

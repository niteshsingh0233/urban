const User = require(`../models/userModel`);
const { connection } = require("../config/db");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require(`../utils/sendEmail.js`);
const crypto = require(`crypto`);

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

//forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password reset token is -: \n\n ${resetPasswordUrl} \n\n 
  If you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Urban realty Password Recovery`,
      message: message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  //creating token hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        404
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match.", 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
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
  const users = await User.find().sort({ createdAt: -1 });

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

  await user.save({ validateBeforeSave: false });

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

// update interestedIn
exports.interestedInUpdate = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  const { interestedIn } = req.body;

  user.interestedIn = interestedIn;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    interest: user.interestedIn,
    user,
  });
});

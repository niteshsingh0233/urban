const User = require(`../models/userModel`);
const { connection } = require("../config/db");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandler");

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

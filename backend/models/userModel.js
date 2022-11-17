const mongoose = require(`mongoose`);
const validator = require(`validator`);
const bcrypt = require("bcryptjs");
const jwt = require(`jsonwebtoken`);
const crypto = require(`crypto`); //built-in module

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Enter Your name"],
    minLength: [5, "Name should have more than 5 chars."],
    maxLength: [30, "Name should not have more than 30 chars."],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Enter Your Email-id"],
    validate: [validator.isEmail, "Please enter valid Email-id"],
  },
  mobile: {
    type: Number,
    unique: true,
    required: [true, "Enter your mobile No"],
    length: [10, "Mobile no should be of 10 digit"],
  },
  password: {
    type: String,
    required: [true, "Enter Your Password"],
    minLength: [8, "Password should have more than 8 char."],
    select: false,
  },
  role: {
    type: String,
    default: "user",
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  interestedIn: {
    type: String,
  },
  wishList: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Home",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,

  resetPasswordExpire: Date,
});

// password crypting/hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.getResetPasswordToken = function () {
  //Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);

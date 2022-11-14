const mongoose = require(`mongoose`);
const validator = require(`validator`);
const bcrypt = require("bcryptjs");
const jwt = require(`jsonwebtoken`);

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

module.exports = mongoose.model("User", userSchema);

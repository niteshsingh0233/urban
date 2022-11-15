const express = require(`express`);
const {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updatePassword,
} = require(`../controllers/userController`);
const { isAuthenticatedUser } = require(`../middleware/auth.js`);

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

module.exports = router;

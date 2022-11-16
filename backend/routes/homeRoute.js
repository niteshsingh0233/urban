const express = require(`express`);
const {
  createHome,
  getAllHomes,
  getSingleHome,
  updateHome,
  deleteHome,
} = require("../controllers/homeController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require(`../middleware/auth.js`);

const router = express.Router();

router.route("/homes").get(getAllHomes);

router
  .route("/admin/home/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createHome);

router.route("/home/:id").get(isAuthenticatedUser, getSingleHome);

router
  .route("/admin/home/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateHome)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteHome);

module.exports = router;

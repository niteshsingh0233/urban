const express = require(`express`);
const {
  createHome,
  getAllHomes,
  getSingleHome,
  updateHome,
  deleteHome,
  wishlistHome,
  removeWishlist,
  findNearbyHomes,
  findFilteredHomes,
  priceFilterHomes,
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

router
  .route("/user/home/wishlist/:id")
  .put(isAuthenticatedUser, wishlistHome)
  .delete(isAuthenticatedUser, removeWishlist);

router.route("/homes/:area").get(isAuthenticatedUser, findNearbyHomes);

router
  .route("/homes/category/:category")
  .get(isAuthenticatedUser, findFilteredHomes);

router.route("/homes/filter/price").get(isAuthenticatedUser, priceFilterHomes);

module.exports = router;

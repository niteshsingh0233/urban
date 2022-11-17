const express = require(`express`);
const router = express.Router();

const {
  createContactUs,
  getAllContactUs,
  getSingleContactUs,
  updateContactStatus,
  deleteContactUs,
} = require("../controllers/contactController");
const {
  isAuthenticatedUser,
  authorizeRoles,
} = require(`../middleware/auth.js`);

router.route("/contact/new").post(createContactUs);

router
  .route("/admin/contacts/all")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllContactUs);

router
  .route("/admin/contact/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleContactUs)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateContactStatus)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteContactUs);

module.exports = router;

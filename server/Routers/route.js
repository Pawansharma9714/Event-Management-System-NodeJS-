const express = require("express");
const router = express.Router();
const verifyToken = require("../Middleware/auth");
const Auth = require("../controller/Auth/Auth");
const ManageOrganizer = require("../controller/ManageOrganizer/manageOrganizer");

router.post("/auth/login", Auth.login);
router.post("/auth/change-password", verifyToken, Auth.changePassword);
router.post("/auth/forgot-password", verifyToken, Auth.forgotPassword);
router.post("/auth/logout", verifyToken, Auth.logout);

router.post("/organizer-list", verifyToken, ManageOrganizer.organizerList);
router.post("/add-organizer", verifyToken, ManageOrganizer.addOrganizer);
router.post(
  "/edit-organizer/:organizerID",
  verifyToken,
  ManageOrganizer.editOrganizer
);
router.post(
  "/update-organizer/:organizerID",
  verifyToken,
  ManageOrganizer.updateOrganizer
);
router.delete(
  "/delete-organizer/:organizerID",
  verifyToken,
  ManageOrganizer.deleteOrganizer
);

module.exports = router;

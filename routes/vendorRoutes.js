const express = require("express");
const router = express.Router();

const vendorController = require("../controllers/vendorController");
const authController = require("../controllers/authController");
const adminVerify = require("../middlewares/verifyAdmin");

router.get('/', vendorController.getAllVendorDetails)
router.get('/deactivate/:id', adminVerify , authController.deleteUser)
router.get('/reactivate/:id', authController.reactivateUser)

// router.put("/:id", customerController.uploadProfilePicture);

// router.delete("/:id", customerController.deleteProfile);

module.exports = router;

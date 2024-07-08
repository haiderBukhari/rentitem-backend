const express = require("express");
const router = express.Router();

const customerController = require("../controllers/customerController");
const adminVerify = require("../middlewares/verifyAdmin");

router.put("/:id", customerController.updateProfile);

router.put("/:id", customerController.uploadProfilePicture);

router.delete("/user/:id", adminVerify , customerController.deleteUser);

router.delete("/:id", customerController.deleteProfile);

router.patch("/:id/:type", customerController.updateCustomerConversion);

module.exports = router;

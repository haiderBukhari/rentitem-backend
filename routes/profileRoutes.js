const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");

router.post('/', profileController.createProfile)
router.put('/:id', profileController.updateProfile)
router.get('/:id', profileController.getProfile)

module.exports = router;
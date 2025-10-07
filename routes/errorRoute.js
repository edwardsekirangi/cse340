const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

// Error Route
router.get("/trigger-error", errorController.triggerError);

module.exports = router;

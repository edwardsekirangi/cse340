const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Inventory Routes
router.get("/type/:classificationId", invController.buildByClassificationId);
module.exports = router;

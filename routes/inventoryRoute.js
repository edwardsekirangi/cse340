const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Inventory Routes
router.get("/type/:classificationId", invController.buildByClassificationId);

// Inventory detail route
router.get("/detail/:invId", invController.buildByInvId);

module.exports = router;

const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");
const Util = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");
// Inventory Routes
router.get(
    "/type/:classificationId",
    Util.handleErrors(invController.buildByClassificationId)
);

// Inventory detail route
router.get("/detail/:invId", Util.handleErrors(invController.buildByInvId));

//Management
router.get("/", Util.handleErrors(invController.buildManagement));

//Show form to add a classification
router.get(
    "/add-classification",
    Util.handleErrors(invController.buildAddClassification)
);

// Handle form submission (classification)
router.post(
    "/add-classification",
    invValidate.classificationRules(), // server-side validation rules
    invValidate.checkClassificationData, // validation error handler
    Util.handleErrors(invController.addClassification) // controller to insert into DB
);

//Add inventory from (GET)
router.get(
    "/add-inventory",
    Util.handleErrors(invController.buildAddInventory)
);

//Add inventory (POST)
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    Util.handleErrors(invController.addInventory)
);
module.exports = router;

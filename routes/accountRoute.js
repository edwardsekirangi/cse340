const express = require("express");
const router = express.Router();
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const accountValidate = require("../utilities/account-validation");
const { validationResult } = require("express-validator");
//Controller function goes here

// Inventory Routes
//router.get("/type/:classificationId", invController.buildByClassificationId);

// Account route
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Register route
router.get(
    "/register",
    utilities.handleErrors(accountController.buildRegister)
);

// Registration route with validation
router.post(
    "/register",
    accountValidate.registrationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

//Process the login attempt
router.post(
    "/login",
    accountValidate.loginRules(),
    accountValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;

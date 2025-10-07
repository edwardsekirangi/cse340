const { body, validationResult } = require("express-validator");
const utilities = require(".");
const accountModel = require("../models/account-model");

const invValidate = {};

/* **********************************
 * Registration Data Validation Rules
 * ********************************* */

invValidate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Classification name is required.")
            .matches(/^[A-Za-z0-9]+$/)
            .withMessage("No spaces or special characters allowed."),
    ];
};

invValidate.checkClassificationData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav();
        return res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: errors.array(),
            message: null,
        });
    }
    next();
};

// Adding Vehicles into the inventory rules
invValidate.inventoryRules = () => {
    return [
        body("classification_id")
            .trim()
            .notEmpty()
            .withMessage("Classification is required.")
            .isInt({ min: 1 })
            .withMessage("Invalid classification."),

        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Make is required.")
            .isLength({ max: 50 })
            .withMessage("Make too long."),

        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Model is required.")
            .isLength({ max: 50 })
            .withMessage("Model too long."),

        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description is required.")
            .isLength({ max: 2000 })
            .withMessage("Description too long."),

        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image path is required.")
            .isString()
            .isLength({ max: 255 }),

        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail path is required.")
            .isString()
            .isLength({ max: 255 }),

        body("inv_price")
            .trim()
            .notEmpty()
            .withMessage("Price is required.")
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number."),

        body("inv_year")
            .trim()
            .notEmpty()
            .withMessage("Year is required.")
            .isInt({ min: 1886, max: 2100 })
            .withMessage("Enter a valid year."),

        body("inv_miles")
            .trim()
            .notEmpty()
            .withMessage("Miles is required.")
            .isInt({ min: 0 })
            .withMessage("Miles must be a non-negative integer."),

        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color is required.")
            .isLength({ max: 30 })
            .withMessage("Color too long."),
    ];
};

//Checking for the previously set rules
invValidate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // rebuild sticky view with errors
        const nav = await utilities.getNav();
        const classificationList = await utilities.buildClassificationList(
            req.body.classification_id
        );

        return res.render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            classificationList,
            // sticky values from req.body
            ...req.body,
            success: null,
            error: null,
            errors: errors.array(),
        });
    }
    next();
};

module.exports = invValidate;

const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ************************
 * Build inventory by classification view
 ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    try {
        const classification_id = req.params.classificationId;
        const data =
            await invModel.getInventoryByClassificationId(classification_id);
        const grid = await utilities.buildClassificationGrid(data);
        let nav = await utilities.getNav();
        const className = data[0].classification_name;
        res.render("./inventory/classification", {
            title: className + " vehicles",
            nav,
            grid,
        });
    } catch (error) {
        next(error);
    }
};

/* ************************
 * Build vehicle detail view
 ************************** */
invCont.buildByInvId = async function (req, res, next) {
    try {
        const inv_id = req.params.invId;
        const data = await invModel.getVehicleById(inv_id);
        const vehicleHTML = await utilities.buildVehicleDetail(data);
        let nav = await utilities.getNav();

        res.render("./inventory/detail", {
            title: data.inv_make + " " + data.inv_model,
            nav,
            vehicleHTML,
        });
    } catch (error) {
        next(error);
    }
};

/* ************************
 * Build vehicle management view
 ************************** */
invCont.buildManagement = async function (req, res, next) {
    try {
        let message = req.flash("message");
        message = message.length > 0 ? message[0] : null;

        const nav = await utilities.getNav();
        res.render("./inventory/management", {
            title: "Vehicle Management",
            nav,
            message,
            errors: null,
        });
    } catch (error) {
        next(error);
    }
};

/* ************************
 * Build add classification view
 ************************** */
invCont.buildAddClassification = async function (req, res, next) {
    let nav = await utilities.getNav();
    res.render("inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        message: null,
    });
};

/* ************************
 * Add classification (POST)
 ************************** */
invCont.addClassification = async function (req, res, next) {
    const { classification_name } = req.body;

    try {
        const result = await invModel.addClassification(classification_name);

        if (result) {
            // ✅ Set flash and redirect
            req.flash("message", "Classification added successfully!");
            res.redirect("/inv"); // triggers buildManagement
        } else {
            let nav = await utilities.getNav();
            res.render("inventory/add-classification", {
                title: "Add Classification",
                nav,
                errors: [{ msg: "Failed to add classification. Try again." }],
                message: null,
            });
        }
    } catch (error) {
        next(error);
    }
};

/* Add inventory view (GET) */
invCont.buildAddInventory = async function (req, res, next) {
    try {
        const nav = await utilities.getNav();
        const classificationList = await utilities.buildClassificationList();

        res.render("inventory/add-inventory", {
            title: "Add New Vehicle",
            nav,
            classificationList,
            // sticky values (empty initial)
            classification_id: "",
            inv_make: "",
            inv_model: "",
            inv_description: "",
            inv_image: "/images/no-image-available.png",
            inv_thumbnail: "/images/no-image-available-tn.png",
            inv_price: "",
            inv_year: "",
            inv_miles: "",
            inv_color: "",
            // messages
            success: null,
            error: null,
            errors: null,
        });
    } catch (err) {
        next(err);
    }
};

/* Add inventory (POST) */
invCont.addInventory = async function (req, res, next) {
    try {
        // Use DB field names to keep data straight
        const {
            classification_id,
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
        } = req.body;

        const result = await invModel.addInventory({
            classification_id: Number(classification_id),
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price: Number(inv_price),
            inv_year: Number(inv_year),
            inv_miles: Number(inv_miles),
            inv_color,
        });

        if (result) {
            req.flash("success", "Inventory item added successfully!");
            return res.redirect("/inv");
        } else {
            req.flash("error", "Failed to add inventory item. Try again.");
            return res.redirect("/inv/add-inventory");
        }
    } catch (err) {
        next(err);
    }
};

module.exports = invCont;

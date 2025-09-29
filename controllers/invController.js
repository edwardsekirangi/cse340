const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ************************
 * Build inventory by classification view
 ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
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
};

//Function to build the vehicle detail view
invCont.buildByInvId = async function (req, res, next) {
    try {
        const inv_id = req.params.invId;
        const data = await invModel.getVehicleById(inv_id);
        const vehicleHTML = await utilities.buildVehicleDetail(data);
        let nav = await utilities.getNav();
        // const vehicleHTML = utilities.buildVehicleDetailHTML(data);

        //Create a dynamic title
        res.render("./inventory/detail", {
            title: data.inv_make + " " + data.inv_model,
            nav,
            vehicleHTML,
        });
    } catch (error) {
        next(error);
    }
};
module.exports = invCont;

const invModel = require("../models/inventory-model");

const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
        list += "<li>";
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>";
        list += "</li>";
    });
    list += "</ul>";
    return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
    let grid;
    if (data.length > 0) {
        grid = '<ul id="inv-display">';
        data.forEach((vehicle) => {
            grid += "<li class='vehicle-card'>";
            grid += "<div class='vehicle-card-content'>"; // ✅ New wrapper starts here

            grid +=
                '<a href="../../inv/detail/' +
                vehicle.inv_id +
                '" title="View ' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                ' details"><img src="' +
                vehicle.inv_thumbnail +
                '" alt="Image of ' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                ' on CSE Motors" /></a>';

            grid += '<div class="namePrice">';
            grid += "<hr />";
            grid += "<h2>";
            grid +=
                '<a href="../../inv/detail/' +
                vehicle.inv_id +
                '" title="View ' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                ' details">' +
                vehicle.inv_make +
                " " +
                vehicle.inv_model +
                "</a>";
            grid += "</h2>";
            grid +=
                "<span>$" +
                new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
                "</span>";
            grid += "</div>";

            grid += "</div>"; // ✅ New wrapper ends here
            grid += "</li>";
        });

        grid += "</ul>";
    } else {
        grid +=
            '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
};

//Build the vehicle detail view HTML
Util.buildVehicleDetail = async function (data) {
    let detail;
    if (data) {
        detail = '<div id="vehicleDetail">';
        detail += '<div class="vehicle-card-box">';

        // Vehicle Image
        detail += '<div class="vehicleImage">';
        detail +=
            '<img src="' +
            data.inv_image +
            '" alt="Image of ' +
            data.inv_make +
            " " +
            data.inv_model +
            ' on CSE Motors" />';
        detail += "</div>";

        // Vehicle Info
        detail += '<div class="vehicleInfo">';
        detail += "<h2>" + data.inv_make + " " + data.inv_model + "</h2>";
        detail += "<hr />";
        detail += '<div class="vehicleMeta">';

        // Price
        detail += '<div class="metaItem">';
        detail += "<h3>Price:</h3>";
        detail +=
            "<p>$" +
            new Intl.NumberFormat("en-US").format(data.inv_price) +
            "</p>";
        detail += "</div>";

        // Description
        detail += '<div class="metaItem">';
        detail += "<h3>Description:</h3>";
        detail += "<p>" + data.inv_description + "</p>";
        detail += "</div>";

        // Color
        detail += '<div class="metaItem">';
        detail += "<h3>Color:</h3>";
        detail += "<p>" + data.inv_color + "</p>";
        detail += "</div>";

        // Mileage
        detail += '<div class="metaItem">';
        detail += "<h3>Mileage:</h3>";
        detail +=
            "<p>" +
            new Intl.NumberFormat("en-US").format(data.inv_miles) +
            " miles</p>";
        detail += "</div>";

        detail += "</div>"; // Close vehicleMeta
        detail += "</div>"; // Close vehicleInfo
        detail += "</div>"; // Close vehicle-card-box
        detail += "</div>"; // Close vehicleDetail
    } else {
        detail = "<p>No vehicle found</p>";
    }
    return detail;
};

//Build classification <select> with sticky selection
/* Build classification <select> with sticky selection */
Util.buildClassificationList = async function (classification_id = null) {
    const data = await invModel.getClassifications(); // returns { rows: [...] }
    let classificationList =
        '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach((row) => {
        classificationList += '<option value="' + row.classification_id + '"';
        if (
            classification_id != null &&
            row.classification_id == classification_id
        ) {
            classificationList += " selected ";
        }
        classificationList += ">" + row.classification_name + "</option>";
    });
    classificationList += "</select>";
    return classificationList;
};

//Middleware to handle errors
//Wrap other functions in this for general error handling
Util.handleErrors = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;

const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");

/* **************************************************
 * Deliver login view
 * ************************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        messages: req.flash("notice"), // always pull flash here
    });
}

/* **************************************************
 * Process login
 * ************************************************** */
async function processLogin(req, res, next) {
    const { account_email, account_password } = req.body;

    // TODO: validate credentials with DB + bcrypt.compare
    req.flash("notice", `Welcome back, ${account_email}!`);
    return res.redirect("/account/login"); // 👈 redirect, not render
}

/* **************************************************
 * Deliver registration view
 * ************************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        messages: req.flash("notice"), // consistent
    });
}

/* **************************************************
 * Process registration
 * ************************************************** */
async function registerAccount(req, res) {
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password,
    } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(account_password, 10);

        const regResult = await accountModel.registerAccount(
            account_firstname,
            account_lastname,
            account_email,
            hashedPassword
        );

        if (regResult) {
            req.flash(
                "notice",
                `Congratulations, you're registered ${account_firstname}. Please log in.`
            );
            return res.redirect("/account/login"); // 👈 redirect
        } else {
            req.flash("notice", "Sorry, the registration failed.");
            return res.redirect("/account/register");
        }
    } catch (error) {
        console.error(error);
        req.flash(
            "notice",
            "Sorry, there was an error processing the registration."
        );
        return res.redirect("/account/register");
    }
}

module.exports = { buildLogin, buildRegister, registerAccount, processLogin };

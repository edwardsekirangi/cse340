const utilities = require("../utilities/index");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
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
/* **************************************************
 * Process login
 * ************************************************** */
//Process login request
async function accountLogin(req, res) {
    let nav = await utilities.getNav();
    const { account_email, account_password } = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again");
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        });
        return;
    }
    try {
        if (
            await bcrypt.compare(account_password, accountData.account_password)
        ) {
            delete accountData.account_password;
            const accessToken = jwt.sign(
                accountData,
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: 3600 }
            );
            if (process.env.NODE_ENV === "development") {
                res.cookie("jwt", accessToken, {
                    httpOnly: true,
                    maxAge: 3600 * 1000,
                });
            } else {
                res.cookie("jwt", accessToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 3600 * 1000,
                });
            }
            return res.redirect("/account/");
        } else {
            req.flash(
                "message notice",
                "Please check your credentials and try again."
            );
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            });
        }
    } catch (error) {
        throw new Error("Access Forbidden");
    }
}

//Deliver Account Management View
async function buildAccountManagement(req, res) {
    let nav = await utilities.getNav();
    res.render("account/management", {
        title: "Account Management",
        nav,
        errors: null,
        messages: req.flash(),
    });
}
module.exports = {
    buildLogin,
    buildRegister,
    registerAccount,
    accountLogin,
    buildAccountManagement,
};

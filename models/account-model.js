const pool = require("../database/");

//Register a new account
async function registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
) {
    try {
        const sql =
            "INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
        return await pool.query(sql, [
            account_firstname,
            account_lastname,
            account_email,
            account_password,
        ]);
    } catch (error) {
        console.error("DB insert error:", error);
        return null;
    }
}
/* *****************************
 * Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
    try {
        const result = await pool.query(
            "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
            [account_email]
        );
        return result.rows[0];
    } catch (error) {
        return new Error("No matching email found");
    }
}

/********************************
 * Check if the account exists
 *******************************/
async function checkExistingEmail(account_email) {
    try {
        const result = await pool.query(
            "SELECT account_email FROM account WHERE account_email = $1",
            [account_email]
        );
        // Return a boolean instead of rows
        return result.rowCount > 0;
    } catch (error) {
        console.error("Database error in checkExistingEmail:", error);
        throw error;
    }
}

module.exports = { registerAccount, getAccountByEmail, checkExistingEmail };

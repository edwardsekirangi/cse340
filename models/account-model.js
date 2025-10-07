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

async function checkExistingEmail(account_email) {
    try {
        const sql =
            "SELECT account_email FROM public.account WHERE account_email = $1";
        const result = await pool.query(sql, [account_email]);
        return result.rowCount > 0;
    } catch (error) {
        console.error("DB query error:", error);
        return error.message;
    }
}

module.exports = { registerAccount, checkExistingEmail };

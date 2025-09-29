const { Pool } = require("pg");
require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      if (!isProduction) {
        console.log("executed query", { text });
      }
      return res;
    } catch (error) {
      console.error("error in query", { text, error: error.message });
      throw error;
    }
  },
};

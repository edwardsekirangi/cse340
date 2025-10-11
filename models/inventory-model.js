//Code to interact with the classification and inventory tables in the database
const pool = require("../database/");

//Get all classifications
async function getClassifications() {
    return await pool.query(
        "SELECT * FROM public.classification ORDER BY classification_name"
    );
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
            [classification_id]
        );
        return data.rows;
    } catch (error) {
        console.error("getclassificationsbyid error " + error);
    }
}

// Get a single inventory item by its ID
async function getInventoryById(inv_id) {
  const sql = "SELECT * FROM inventory WHERE inv_id = $1";
  const data = await pool.query(sql, [inv_id]);
  return data.rows[0]; // return one object
}

//Adding a new function to get vehicle by inv_id
async function getVehicleById(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory WHERE inv_id = $1`,
            [inv_id]
        );
        return data.rows[0];
    } catch (error) {
        console.error("getVehicleById error " + error);
    }
}

//Adding a new vehicle to the inventory
async function addClassification(classification_name) {
    try {
        const sql =
            "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
        const data = await pool.query(sql, [classification_name]);
        return data.rows[0];
    } catch (error) {
        console.error("addClassification error:", error);
        return null;
    }
}

// Fetch classifications for select list
async function getClassifications() {
    const sql =
        "SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name";
    const data = await pool.query(sql);
    return data;
}

// Insert inventory item
async function addInventory(inv) {
    try {
        const sql = `
      INSERT INTO public.inventory
        (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color)
      VALUES
        ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING inv_id
    `;
        const params = [
            inv.classification_id,
            inv.inv_make,
            inv.inv_model,
            inv.inv_description,
            inv.inv_image,
            inv.inv_thumbnail,
            inv.inv_price,
            inv.inv_year,
            inv.inv_miles,
            inv.inv_color,
        ];
        const result = await pool.query(sql, params);
        return result.rows[0];
    } catch (err) {
        console.error("addInventory error:", err);
        return null;
    }
}

//Export the functions elsewhere
module.exports = {
    getClassifications,
    getInventoryByClassificationId,
    getVehicleById,
    addClassification,
    getClassifications,
    addInventory,
    getInventoryById,
};

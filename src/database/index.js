const pg = require("pg");
require("dotenv").config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

pool.on("error", (err, client) => {
  console.error("Error: ", err);
  process.exit(-1);
});

pool.connect((err) => {
  return err ? Error("Error in connection", err) : console.log("logged");
});
const query = (text, params, callback) => {
  return pool.query(text, params, callback);
};

module.exports = { query };

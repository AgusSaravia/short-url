const pg = require("pg");
require("dotenv").config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
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

const Client = require("pg/lib/client");
const { getUniqueIdentifier } = require("../utils/getUniqueIdentifier");

const { query } = require("../database/index");
//As the function says it selects the short url of a long one.
async function fetchByLongUrl(longUrl) {
  const existingLongUrl = await query(
    "SELECT short_url from urls WHERE long_url = $1 ",
    [longUrl]
  );

  return existingLongUrl.rows;
}
// If a collision happens {name of the function}
async function findNextUniqueShortUrl() {
  let id;
  let isUrlIdUnique = false;

  //If collisions happens this will run until
  while (!isUrlIdUnique) {
    id = getUniqueIdentifier();

    const result = await query("SELECT * FROM urls WHERE short_url = $1", [id]);
    isUrlIdUnique = result.rows.length === 0;
  }

  return id;
}

async function createShortUrl({ longUrl, id }) {
  return query("INSERT INTO urls (long_url, short_url) VALUES ($1, $2)", [
    longUrl,
    id,
  ]);
}

module.exports = {
  fetchByLongUrl,
  findNextUniqueShortUrl,
  createShortUrl,
};

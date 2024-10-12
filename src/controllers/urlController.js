const { query } = require("../database/index");
const {
  findNextUniqueShortUrl,
  fetchByLongUrl,
  createShortUrl,
} = require("../utils/queries");

const validator = require("validator");

const invariant = require("tiny-invariant");

const dayjs = require("dayjs");

function generateURLTableRow({ long_url, short_url, created_at, clicks }) {
  return `
     <tr>
            <td id="longUrl">${long_url}</td>
            <td id="shortUrlLink"><a  href="/${short_url}">${short_url}</a></td>
            <td>${clicks}</td>
            <td>${dayjs(created_at).fromNow()}</td>
          </tr>

  `;
}
async function generateURLTable() {
  const res = await query(
    "SELECT short_url, long_url, created_at, clicks from urls order by created_at desc"
  );

  const urlsData = res.rows;

  // console.log(urlsData);

  return `
      <table class="table table-striped">
        <thead>
          <tr>
            <th>URL Original</th>
            <th>URL Corta</th>
            <th>Clicks</th>
            <th>Fecha de creacion</th>
          </tr>
        </thead>
        <tbody>
          ${urlsData.map(generateURLTableRow).join("")}
        </tbody>
      </table>
    `;
}

exports.createShortUrl = async (req, res) => {
  const { longUrl } = req.body;

  console.log(req.body);

  invariant(longUrl, "longUrl is required");
  invariant(
    validator.isURL(longUrl, { require_protocol: true }),
    "Invalid URL format"
  );

  const existingLongUrls = await fetchByLongUrl(longUrl);
  if (existingLongUrls.length > 0) {
    // Estaria bueno notificar al usuario de que no se creo porque ya existe
    return res.send(await generateURLTable());
  }

  const id = await findNextUniqueShortUrl();

  await createShortUrl({
    id,
    longUrl,
  });

  console.log("Short URL created successfully:", id);

  return res.send(await generateURLTable());
};

exports.buildUrlTable = async (req, res) => {
  // await new Promise((resolve) => setTimeout(resolve, 5000));
  return res.send(await generateURLTable());
};

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");

const app = express();
const path = require("path");

const urlController = require("./controllers/urlController.js");
const { query } = require("./database/index.js");
const PORT = process.env.PORT || 4000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

dayjs.extend(relativeTime);

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
}
app.use(errorHandler);

// Serve Home Page
app.get(
  "https://short-url-git-deploytest-agussaravias-projects.vercel.app/",
  (req, res) => {
    const options = {
      root: path.join(__dirname, "../public"),
    };
    const fileName = "index.html";

    res.sendFile(fileName, options, function (err) {
      if (!err) {
        console.log("Sent:", fileName);
      } else {
        console.error("Error sending file:", err);
        res
          .status(500)
          .json({ error: "Internal Server Error, could not render home page" });
      }
    });
  }
);

// API Route to Create Short URL
app.use(express.static("public"));

app.post(
  "https://short-url-git-deploytest-agussaravias-projects.vercel.app/short",
  urlController.createShortUrl
);
app.get(
  "https://short-url-git-deploytest-agussaravias-projects.vercel.app/url-table",
  urlController.buildUrlTable
);

// Route to Handle Redirection
app.get(
  "https://short-url-git-deploytest-agussaravias-projects.vercel.app/:id",
  async (req, res) => {
    const id = req.params.id;

    try {
      const result = await query(
        "SELECT long_url FROM urls WHERE short_url = $1",
        [id]
      );

      if (result.rows.length > 0) {
        const long_url = result.rows[0].long_url;
        const currentClicks = result.rows[0].clicks;

        await query(
          "update urls set clicks = clicks + 1 where short_url = $1",
          [id]
        );

        res.redirect(long_url); // Redirect to the original URL
      } else {
        res.status(404).json({ error: "Short URL not found." });
      }
    } catch (error) {
      console.error("Error fetching original URL:", error);
      res.status(500).json({ error: "Internal Server Error." });
    }
  }
);

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
// function copyToClipboard() {
//   const shortUrlLink = document.getElementById("shortUrlLink");
//   const shortUrl = shortUrlLink.href;
//   navigator.clipboard.writeText(shortUrl).then(() => {
//     alert("URL copiada al portapapeles!");
//   }).catch(() => {
//     alert("Error al copiar la URL. Por favor, copie manualmente.");
//   });
// }

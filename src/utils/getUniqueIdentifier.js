const crypto = require("node:crypto");

exports.getUniqueIdentifier = () => {
  const randomBytes = crypto.randomBytes(4).toString("hex");
  const timestamp = Date.now().toString();
  const uniqueEntry = randomBytes + timestamp;
  const hash = crypto.createHash("sha256").update(uniqueEntry).digest("hex");
  const id = hash.substr(0, 7);

  return id;
};

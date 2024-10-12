const crypto = require("node:crypto");

exports.getUniqueIdentifier = () => {
  const randomBytes = crypto.randomBytes(4).toString("hex");
  const timestamp = Date.now().toString();
  const uniqueEntry = randomBytes + timestamp;
  const id = uniqueEntry.substr(0, 7);

  return id;
};

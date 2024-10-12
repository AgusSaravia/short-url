const {v4: uuidv4} = require("uuid");

exports.getUniqueIdentifier = () => {
    return  uuidv4().substr(0, 7);
};

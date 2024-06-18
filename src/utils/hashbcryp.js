const bcrypt = require("bcrypt");

const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

const isValidPassword = (inputPassword, storedPasswordHash) => {
    return bcrypt.compareSync(inputPassword, storedPasswordHash);
};

module.exports = {
    createHash,
    isValidPassword
};

const jwt = require("jsonwebtoken");

const createJWT = id => {
  const token = jwt.sign({ id }, "sadoivnoiasdnviosand");
  return token;
};

module.exports = createJWT;

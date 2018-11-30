const jwt = require("jsonwebtoken");

const decodeJWT = async token => {
  try {
    const decoded = jwt.verify(token, "sadoivnoiasdnviosand");
    const { id } = decoded;
    // const user = await User.findOne({ id });
    // return user;
    return id;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

module.exports = decodeJWT;

const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.header("token");
  if (!token || token === "null")
    return res.status(401).send({
      status: 401,
      message: "Ban chua login",
    });
  try {
    const decode = jwt.verify(token, "hieuvh9");

    if (decode) {
      req.user = decode;
      return next();
    } else {
      res.status(401).send("Ban chua login");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  authenticate,
};

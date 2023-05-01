const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.body.headers.authorization) {
      return res.status(401).json({ message: "Provide Token", status: false });
    }
    const token = req.headers.authorization
      ? req.headers.authorization
      : req.body.headers.authorization;

    const verified = jwt.verify(token, "tokenSecret");
    if (verified) {
      return next();
    }
  } catch (error) {
    return res.status(401).send(error);
  }
};

module.exports = verifyToken;

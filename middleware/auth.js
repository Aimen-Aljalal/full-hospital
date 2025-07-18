const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: `header can't be authorized` });
  }
  try {
    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, "SuperSuperKey");
    req.userId = decode.userId;
    req.role = decode.role;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `problem in authorization` });
  }
};

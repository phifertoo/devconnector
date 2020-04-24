const jwt = require("jsonwebtoken");
// The default.json properties are automatically brought in when you specify the config folder
const config = require("config");

module.exports = function (req, res, next) {
  // get authentication token from header
  const token = req.header("x-auth-token");

  //check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // verify token
  try {
    /* if token is valid, we set a req object property called "user" with a value 
    called decoded.user */
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    // set a user property in the request to a value of user in the decoded object
    req.user = decoded.user;
    /* Since the auth function will be used as a callback in the get/post functions,
    you need to call the next function so that the next function will be called in 
    the POST and GET functions. */
    next();
  } catch {
    //if token is not valid
    res.status(401).json({ msg: "Token is not valid" });
  }
};

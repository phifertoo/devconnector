const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const { check, validationResult } = require("express-validator");
const config = require("config");
const jwt = require("jsonwebtoken");

// route: GET api/auth
// description: test route
// access: public

/* putting "auth" as the second parameter sets the route to require authorization.
 auth is a callback function defined in the middleware/auth file.Send the user data */
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route: POST api/auth
// description: Authenticate user and get token
// access: public

//submit data to server using the check and validationResult methods from express-validator
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Destructure the name, email, passwords properties fromthe body. Create a user
    const { email, password } = req.body;
    try {
      // see if user exists by email. If the findOne finds a match, it will return true
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }
      /* compare passwords. bcrypt compare method compares a plain text password with an encrypted password and determines if they are the same
      password is plain text and user.password comes from the database and is encrypted*/
      const isMatch = await bcrypt.compare(password, user.password);

      /* if there is no match, return invalid credentials*/
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid credentials" }] });
      }

      // return jasonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      /*Create a JWT token. A JWT is created whenever there is an authentication */
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;

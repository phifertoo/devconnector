const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");
// route: POST api/users
// description: register user
// access: public

//submit data to server using the check and validationResult methods from express-validator
router.post(
  "/",
  [
    check("name", "Name is Required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //create a user. Destructure the name, email, passwords properties fromthe body
    const { name, email, password } = req.body;
    try {
      // see if user exists by email. If the findOne finds a match, it will return true
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // get users gravatar which is an avatar for the app. "mm" is the default avatar. size, rating, and default avatar
      const avatar = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

      //create a new user
      user = new User({ name, email, avatar, password });

      /* encrypt password. Create "salt" which is additional characters to the password to make it harder to crack.
      Then, add the salt to the password and "hash" the password+salt. Then save the password to mongoDB using the imported schema*/
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      /* Create a JWT token. config.get("jwtToken") is to pass in the secret. Send the 
      JWT back to the client via res.json({token}) 
       */

      const payload = {
        user: {
          id: user.id,
        },
      };
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

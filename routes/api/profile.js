const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const request = require("request");
const config = require("config");
const Post = require("../../models/Post");

// route GET api/profile/me
// description: fetches a specific profile
// access: private

router.get("/me", auth, async (req, res) => {
  try {
    /* Using the userID that comes through the request token. we find the appropriate user. Then, we set populate the Profile from the ['name','avatar'] of 'user'  */
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);
    /* if there is no profile */
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }
    /* if there is a profile we will respond with the profile*/
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route: POST api/profile/ [fetches a specific profile]
// description: create or update user profile
// access: private

/* authenticate and check if status and skills are empty*/

router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  /* Using the validationResult method from express-validator, we determine if there are any errors. */
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // destructure the properties from the body that's received from the request
    const {
      company,
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;
    //Build profile object and define all the properties in the profile
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    /* the input is a string of skills that are separated by a comma and possibly some spaces. So, you need to split the string into an array of strings
      by using the split method. Then, you map each element to remove the spaces by using the trim() method*/
    if (skills) {
      profileFields.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((skill) => " " + skill.trim());
    }
    // Build social object. Note, you need to initialize the social object to {} otherwise you will be trying to set the value of an undefined object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      /* look for a profile based on the userId that comes from the token*/
      let profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        //update profile. $set is the same as $addFields which adds all profileFields to the profile
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        // return the profile if the profile is found
        return res.json(profile);
      }
      // if the profile is not found, you need to create a new profile. Save it to mongoDB. Return the profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// route: GET api/profile/
// description: Get all profiles
// access: public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route: GET api/profile/user/:user_id [user_id is a placeholder]
// description: Get profile by user ID
// access: public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      /* the slug can be retrieved in the req.params. Therefore, whatever
        username is attached to the user will be retrieved then the user
        will be set to this value.*/
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    // If no profile, send error message
    if (!profile) return res.status(400).json({ msg: "Profile not found" });
    //If profile exists, respond with profile
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    /* If an invalid objectID is passed in, the server will throw an error. A valid objectID has
  the appropriate length (24 characters). An invalid objectID's length is more or less than 24
  characters. Therefore, we need to return a response if this specific error occurs*/
    if (err.name === "CastError") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server Error");
  }
});

// route: DELETE api/profile/
// description: delete profile, user, and posts
// access: private

router.delete("/", auth, async (req, res) => {
  try {
    //remove users post
    await Post.deleteMany({ user: req.user.id });
    // remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.send({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// route: PUT api/profile/experience
// description: add profile experience
// access: private

router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required").not().isEmpty(),
      check("company", "Company is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.err(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// route: DELETE api/profile/experience/:exp_id
// description: delete experience from profile
// access: private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    /*get index of profile experience you want to remove. We are mapping so that there is an
      array of item.id's (the map function returns an array of returns). Then, we are using the
      indexOf method to find the index of the experience ID that you want to delete. Then, use
      the splice method to remove that experience from the array. */
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.err(err.message);
    res.status(500).send("Server Error");
  }
});

// route: PUT api/profile/education
// description: add profile education
// access: private

router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required").not().isEmpty(),
      check("degree", "Degree is required").not().isEmpty(),
      check("fieldofstudy", "Field of Study is required").not().isEmpty(),
      check("from", "From date is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// route: DELETE api/profile/education/:exp_id
// description: delete education from profile
// access: private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    /*get index of profile education you want to remove. We are mapping so that there is an
      array of item.id's (the map function returns an array of returns). Then, we are using the
      indexOf method to find the index of the education ID that you want to delete. Then, use
      the splice method to remove that education from the array. */
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);
    await profile.save();
    res.json(profile);
  } catch (err) {
    console.err(err.message);
    res.status(500).send("Server Error");
  }
});

// route: GET api/profile/github/:username
// description: get user repos from github
// access: public

router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret={config.get('githubSecret')}`,
      method: "GET",
      headers: { "user-agent": "node.js" },
    };
    request(options, (error, response, body) => {
      if (error) console.error(error);
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "No Github profile found" });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

const express = require("express");
const connectDB = require("./config/db");
const app = express();
const path = require("path");

/* Calling the connection function defined in the db.js file in the config folder. 
This connects mongoDB */
connectDB();

// Initialize Express middleware

app.use(express.json({ extended: false }));

//when the app receives a request for the given route, the specified file/app will run
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  //set static/public folder as client/build. This is for production in Heroku
  app.use(express.static("client/build"));
  // any route other than the routes specified above will be served with index.html
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

/* Setting up the server. Proccess.env.PORT looks for environment variable called PORT.
Since the app is served by Heroku, Heroku will look in process.env.PORT to serve 
the app. If there is no environment variable it will default to 5000 (
    for local deployment) */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));

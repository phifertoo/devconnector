const express = require("express");
const app = express();
//looks for environment variable called PORT. It will get the port from Heroku. If there is no environment variable it will default to 5000 (local port)
app.get("/", (req, res) => res.send("API Running Now"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on ${PORT}`));

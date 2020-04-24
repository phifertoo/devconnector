/* mongoDB connection */
/* using mongoose to connect to MongoDB*/
const mongoose = require("mongoose");
/* import the config package that contains the connection string in the default.json file*/
const config = require("config");
/* The connection string is stored in an object called "mongoURI" in the default.json file.*/
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    /* connect using the connection string in the config*/
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err.message);
    /* exit process if failure*/
    process.exit(1);
  }
};

module.exports = connectDB;

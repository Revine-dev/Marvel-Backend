const express = require("express");
const formidableMiddleware = require("express-formidable");
const app = express();
app.use(formidableMiddleware());
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

app.use(cors());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const Login = require("./routes/Login");
const Favorites = require("./routes/Favorite");
const API = require("./routes/marvelApi");

app.use(Login);
app.use(API);
app.use(Favorites);

app.all("/", function (req, res) {
  res.json({ message: "Welcome to Marvel Application !" });
});

app.all("*", function (req, res) {
  return res.status(404).json({ error: true, message: "Page not found" });
});

app.listen(process.env.PORT || 3100, () => {
  console.log("Server started");
});

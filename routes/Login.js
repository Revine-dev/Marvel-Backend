const express = require("express");
const router = express.Router();
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/Users");

const isValidMail = (email) => {
  let re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

router.post("/users/signup", async (req, res) => {
  const { email, username, password } = req.fields;
  if (email && username && password) {
    if (!username.match(/[A-Za-z]/)) {
      return res.json({
        error: true,
        message: "Le format du nom d'utilisateur est incorrect.",
      });
    } else if (!isValidMail(email)) {
      return res.json({ error: true, message: "L'email n'est pas valide." });
    }
    const salt = uid2(16);
    const hash = SHA256(password + salt).toString(encBase64);
    const token = uid2(16);
    const isUser = await User.findOne({ email });

    if (isUser) {
      return res.json({
        error: true,
        message: "Désolé, cet email est déjà pris.",
      });
    }

    const newUser = new User({
      email,
      account: {
        username,
      },
      token,
      hash,
      salt,
    });
    await newUser.save();
    return res.status(200).json({
      success: true,
      data: {
        id: newUser._id,
        token: newUser.token,
        account: newUser.account,
      },
    });
  }
  res.status(401).json("Deny");
});

router.post("/users/login", async (req, res) => {
  const { email, password } = req.fields;
  if (email && password) {
    if (!isValidMail(email)) {
      return res.json({ error: true, message: "L'email n'est pas valide." });
    }
    let user = await User.findOne({ email });
    if (!user) {
      user = {
        salt: null,
        password: null,
      };
    }
    const hash = SHA256(password + user.salt).toString(encBase64);
    if (hash === user.hash) {
      return res.json({
        success: true,
        data: {
          _id: user._id,
          token: user.token,
          account: user.account,
        },
      });
    } else {
      return res.json({
        error: true,
        message: "Le mail ou le mot de passe est incorrect.",
      });
    }
  }
  fn.accesDenied(res);
});

module.exports = router;

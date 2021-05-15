const express = require("express");
const router = express.Router();

const User = require("../models/Users");
const Favorite = require("../models/Favorite");

const isAuthenticated = async (req, res, next) => {
  if (req.headers.authorization) {
    const user = await User.findOne({
      token: req.headers.authorization.replace("Bearer ", ""),
    }).select("account _id email");

    if (!user) {
      return res.status(401).json({ error: true, message: "Accès interdit" });
    } else {
      req.user = user;
      return next();
    }
  } else {
    return res.status(401).json("Deny");
  }
};

router.get("/favorites", isAuthenticated, async (req, res) => {
  const favorites = await Favorite.find({ user: req.user });
  return res.status(200).json(favorites);
});

router.post("/favorites/save", isAuthenticated, async (req, res) => {
  const { id_card, item, category } = req.fields;
  try {
    const newFavorite = new Favorite({
      id_card,
      item,
      category,
      user: req.user,
    });
    await newFavorite.save();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
});

router.post("/favorites/remove", isAuthenticated, async (req, res) => {
  const { id, category } = req.fields;
  try {
    const favoriteExist = await Favorite.findOneAndDelete({
      id_card: id,
      category: category,
    });
    if (favoriteExist) {
      res.status(200).json({ success: true });
    } else {
      res.json({ success: false, message: "Not found" });
    }
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
});

module.exports = router;

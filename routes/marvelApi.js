const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/comics", async (req, res) => {
  const page = !req.query.page ? 1 : req.query.page;
  let title = req.query.search ? req.query.search : "";
  title = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const limit = !req.query.limit ? 100 : req.query.limit;
  const skip = (page - 1) * limit;
  const comics = await axios.get(
    `https://lereacteur-marvel-api.herokuapp.com/comics?skip=${skip}&limit=${limit}&title=${title}&apiKey=${process.env.MARVEL_API_KEY}`
  );
  res.json(comics.data);
});

router.get("/comic/:id", async (req, res) => {
  const comic = await axios.get(
    `https://lereacteur-marvel-api.herokuapp.com/comic/${req.params.id}?apiKey=${process.env.MARVEL_API_KEY}`
  );
  res.json(comic.data);
});

router.get("/character/:id", async (req, res) => {
  const comic = await axios.get(
    `https://lereacteur-marvel-api.herokuapp.com/comics/${req.params.id}?apiKey=${process.env.MARVEL_API_KEY}`
  );
  res.json(comic.data);
});

router.get("/characters", async (req, res) => {
  const page = !req.query.page ? 1 : req.query.page;
  let title = req.query.search ? req.query.search : "";
  title = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const limit = !req.query.limit ? 100 : req.query.limit;
  const skip = (page - 1) * limit;
  const comic = await axios.get(
    `https://lereacteur-marvel-api.herokuapp.com/characters?skip=${skip}&limit=${limit}&name=${title}&apiKey=${process.env.MARVEL_API_KEY}`
  );
  res.json(comic.data);
});

module.exports = router;

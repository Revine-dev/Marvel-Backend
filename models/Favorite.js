const mongoose = require("mongoose");

const Favorite = mongoose.model("Favorite", {
  id_card: String,
  item: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  category: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = Favorite;

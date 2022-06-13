const mongoose = require("mongoose");

const traitFloorSchema = new mongoose.Schema([
  {
    trait_floors: { type: Array, default: [] },
    policy_id: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
]);

exports.traitFloorSchema = traitFloorSchema;

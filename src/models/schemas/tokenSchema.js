const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema([
  {
    policy_id: { type: String, default: " " },
    asset_name: { type: String, default: " " },
    valueOfToken: { type: Number, default: 0 },
    tokenValueMultiplier: { type: Number, default: 1 },
    traitsAreUnique: { type: Boolean, default: true },
    optimized_source: { type: String, default: " " },
    date: { type: Date, default: Date.now },
  },
]);

exports.tokenSchema = tokenSchema;

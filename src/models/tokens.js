const mongoose = require("mongoose");

const Token = mongoose.model(
  "Tokens_Data",
  new mongoose.Schema([
    {
        policy_id: { type: String, default: " " },
        asset_name: { type: String, default: " " },
        valueOfToken: { type: Number, default: 0 },
        tokenValueMultiplier: { type: Number, default: 0.000001 },
        traitsAreUnique: { type: Boolean, default: false },
        optimized_source: { type: String, default: " " },
        show: {type: Boolean, default: false},
        date: { type: Date, default: Date.now },
      },
    ]),
  "Tokens_Data"
);

exports.Token = Token;

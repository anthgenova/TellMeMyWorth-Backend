const mongoose = require("mongoose");

const PolicyId = mongoose.model(
  "Policy_Ids",
  new mongoose.Schema([
    {
      policy_id: { type: String, default: "" },
      display_name: { type: String, default: "" },
      traitsAreUnique: { type: Boolean, default: true },
      fungible: { type: Boolean },
      metaverse: { type: Boolean },
      collectionSize: { type: Number, default: -1 },
      date: { type: Date, default: Date.now },
    },
  ]),
  "Policy_Ids"
);

exports.PolicyId = PolicyId;

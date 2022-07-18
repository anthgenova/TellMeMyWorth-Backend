const mongoose = require("mongoose");

const PolicyId = mongoose.model(
  "Policies_Data",
  new mongoose.Schema([
    {
      policies: { type: String, default: "" },
      id: {type: String, default: ""},
      collection_name: { type: String, default: "" },
      traitsAreUnique: { type: Boolean, default: true },
      fungible: { type: Boolean, default: false },
      metaverse: { type: Boolean, default: false },
      supply: { type: Number, default: 0 },
      floor: { type: Number, default: 0 },
      listings: { type: Number, default: 0 },
      sales: { type: Number, default: 0 },
      date: { type: Date, default: Date.now },
    },
  ]),
  "Policies_Data"
);

exports.PolicyId = PolicyId;

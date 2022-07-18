const mongoose = require("mongoose");

const Floor = mongoose.model(
  "Floors",
  new mongoose.Schema([
    {
      trait_floors: { type: Array, default: {} },
      policy_id: { type: String, default: "" },
      date: { type: Date, default: Date.now },
    },
  ]),
  "Floors",
);

exports.Floor = Floor;


// const mongoose = require("mongoose");

// const PolicyId = mongoose.model(
//   "Policies_Data",
//   new mongoose.Schema([
//     {
//       policies: { type: String, default: "" },
//       id: {type: String, default: ""},
//       collection_name: { type: String, default: "" },
//       traitsAreUnique: { type: Boolean, default: true },
//       fungible: { type: Boolean, default: false },
//       metaverse: { type: Boolean, default: false },
//       supply: { type: Number, default: 1 },
//       floor: { type: Number, default: 0 },
//       date: { type: Date, default: Date.now },
//     },
//   ]),
//   "Policies_Data"
// );

// exports.PolicyId = PolicyId;

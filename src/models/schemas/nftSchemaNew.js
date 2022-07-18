const mongoose = require("mongoose");
  
const nftSchema = new mongoose.Schema([
    {
    asset: { type: String, default: "" },
    policy_id: { type: String, default: "" },
    asset_name: { type: String, default: "" },
    fingerprint: { type: String, default: "" },
    quantity: { type: String, default: "" },
    onchain_metadata: { type: Object, default: {} },
    traitsAreUnique: { type: Boolean, default: true },
    valueOfBestTrait: { type: Number, default: 0 },
    bestTrait: { type: String, default: "" },
    rarity_rank: {type: Number, default: -1 },
    date: { type: Date, default: Date.now },
    },
])


exports.nftSchema = nftSchema;

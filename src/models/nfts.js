const mongoose = require("mongoose");
  
const Nft = mongoose.model(
    "Nfts",
    new mongoose.Schema([
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
        date: { type: Date, default: Date.now },
        },
    ]),
    "Nfts",
)
// const Nft = mongoose.model(
//     "Nfts",
//     new mongoose.Schema([
//         {
//         traits: { type: Array, default: [] },
//         quantity: { type: Number, default: -1 },
//         policy_id: { type: String, default: "" },
//         source: { type: String, default: "" },
//         asset_id: { type: String, default: "" },
//         display_name: { type: String, default: "" },
//         asset_name: { type: String, default: "" },
//         collections: { type: Array, default: [] },
//         fingerprint: { type: String, default: "" },
//         asset_num: { type: Number, default: -1 },
//         traitsAreUnique: { type: Boolean, default: true },
//         valueOfBestTrait: { type: Number, default: 0 },
//         bestTrait: { type: String, default: "" },
//         date: { type: Date, default: Date.now },
//         },
//     ]),
//     "Nfts",
// )



exports.Nft = Nft;

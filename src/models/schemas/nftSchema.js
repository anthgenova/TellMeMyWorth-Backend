const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema([
  {
    reports: { type: Number, default: -1 },
    listed_at: { type: Date, default: new Date() },
    traits: { type: Array, default: [] },
    quantity: { type: Number, default: -1 },
    policy_id: { type: String, default: "" },
    initial_mint_tx_hash: { type: String, default: "" },
    has_pending_transaction: { type: Boolean, default: false },
    last_sale_lovelace: { type: Number, default: -1 },
    listing_lovelace: { type: Number, default: -1 },
    created_at: { type: Date, default: new Date() },
    _meta: { type: Array, default: [] },
    source: { type: String, default: "" },
    asset_id: { type: String, default: "" },
    display_name: { type: String, default: "" },
    listings: { type: String, default: "" },
    optimized_source: { type: String, default: "" },
    asset_name: { type: String, default: "" },
    collections: { type: Array, default: [] },
    fingerprint: { type: String, default: "" },
    asset_num: { type: Number, default: -1 },
    mediatype: { type: String, default: "" },
    likes: { type: Number, default: -1 },
    is_taken_down: { type: Boolean, default: false },
    traitsAreUnique: { type: Boolean, default: true },
    valueOfBestTrait: { type: Number, default: 0 },
    bestTrait: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
]);

exports.nftSchema = nftSchema;

const mongoose = require("mongoose");

const Wallet = mongoose.model(
  "Wallets",
  new mongoose.Schema([
    {
      addr: { type: String, default: "" },
      itn_reward: { type: Number, default: -1 },
      lovelaces: { type: Number, default: -1 },
      pool: { type: String, default: "" },
      reward: { type: Number, default: -1 },
      synched: { type: Number, default: -1 },
      tokens: { type: Array, default: [] },
      utxos: { type: Number, default: -1 },
      vote_reward: { type: Number, default: -1 },
      withdrawal: { type: Number, default: -1 },
      date: { type: Date, default: Date.now },
    },
  ]),
  "Wallets"
);

exports.Wallet = Wallet;

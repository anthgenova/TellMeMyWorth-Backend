const mongoose = require("mongoose");
const { insertTokenData } = require("../services/insertTokenData");
// const { getTokenPolicyIds } = require("../services/getTokenPolicyIds");
// const { insertValueOfBestTrait } = require("../services/insertValueOfBestTrait");
const { configSetting } = require('../../config.js')

const database = configSetting()

mongoose.connect(database)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const policyId = "1d7f33bd23d85e1a25d87d86fac4f199c3197a2f7afeb662a0f34e1e";
const ticker = "worldmobiletoken";
const multiplier = 1;
// insertWalletData(policyId, database)
// walletAddress     = Wallet address ; can be addr or stake
// database          = database to save to. DEFAULT = 'test'

// Comment out line once complete!!
async function tokenDataInsert() {
//   const collectionName = await insertUniqueNftProject(policyId, collectionSize, "TellMeMyWorth_Collections");
//   await insertFloorData(collectionName, "TellMeMyWorth_Collections");
  await insertTokenData(policyId, ticker, multiplier);
  mongoose.disconnect();
}

tokenDataInsert();
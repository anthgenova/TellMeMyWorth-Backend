const mongoose = require("mongoose");
const { insertTokenData } = require("../services/insertTokenData");
// const { getTokenPolicyIds } = require("../services/getTokenPolicyIds");
// const { insertValueOfBestTrait } = require("../services/insertValueOfBestTrait");
const { configSetting } = require('../../config.js')

const database = configSetting()

mongoose.connect(database)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const policyId = "6cfbfedd8c8ea23d264f5ae3ef039217100c210bb66de8711f21c903";
const ticker = "CNFT";
const multiplier = .000001;
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
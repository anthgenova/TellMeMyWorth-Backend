const mongoose = require("mongoose");
const { insertUniqueNftProject } = require("../services/insertUniqueNftProject");
const { insertFloorData } = require("../services/insertFloorData");
const { insertValueOfBestTrait } = require("../services/insertValueOfBestTrait");
const { configSetting } = require('../../config.js')

const database = configSetting()

mongoose.connect(database)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const policyId = "637bae5845e801779651d997bedc2dad53ddbe0d5f940b4ff723d769";
const collectionSize = 5555;
// insertWalletData(policyId, database)
// walletAddress     = Wallet address ; can be addr or stake
// database          = database to save to. DEFAULT = 'test'

// Comment out line once complete!!
async function allUniqueNftDataInsert() {
  const collectionName = await insertUniqueNftProject(policyId, collectionSize, "TellMeMyWorth_Collections");
  await insertFloorData(collectionName, "TellMeMyWorth_Collections");
  await insertValueOfBestTrait(collectionName, "TellMeMyWorth_Collections");
  mongoose.disconnect();
}

allUniqueNftDataInsert();

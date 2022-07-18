const mongoose = require("mongoose");
const { insertUniqueNftProject } = require("../services/insertUniqueNftProject");
const { insertFloorData } = require("../services/insertFloorData");
const { insertValueOfBestTrait } = require("../services/insertValueOfBestTrait");
const { configSetting } = require('../../config.js')

const database = configSetting()

mongoose.connect(database)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const policyId = "c136a71a17ce49b66a7eb5c90aa20d0563bf66ef9928351e19419cda";
const collectionSize = 10000;
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

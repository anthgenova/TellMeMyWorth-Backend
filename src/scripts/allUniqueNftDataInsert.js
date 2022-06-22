const mongoose = require("mongoose");
const { insertUniqueNftProject } = require("../services/insertUniqueNftProject");
const { insertFloorData } = require("../services/insertFloorData");
const { insertValueOfBestTrait } = require("../services/insertValueOfBestTrait");
const { configSetting } = require('../../config.js')

const database = configSetting()

mongoose.connect(database)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const policyId = "40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728";
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

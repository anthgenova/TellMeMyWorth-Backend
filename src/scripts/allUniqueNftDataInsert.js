const mongoose = require("mongoose");
const { insertUniqueNftProject } = require("../services/insertUniqueNftProject");
const { insertFloorData } = require("../services/insertFloorData");
const { insertValueOfBestTrait } = require("../services/insertValueOfBestTrait");

mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const policyId = "af97d130e1355116105344ff2935bdf32f98a9d756bcfe20320e7c90";
const collectionSize = 754;
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

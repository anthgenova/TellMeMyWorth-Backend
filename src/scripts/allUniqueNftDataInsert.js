const mongoose = require("mongoose");
const { insertUniqueNftProject } = require("../services/insertUniqueNftProject");
const { insertFloorData } = require("../services/insertFloorData");
const { insertValueOfBestTrait } = require("../services/insertValueOfBestTrait");

mongoose.connect(`mongodb+srv://TellTwan:q23LUx8K0617E5pa@TellMeMyWorth-CoreDB-6341cc4d.mongo.ondigitalocean.com/TellMeMyWorth?authSource=admin&replicaSet=TellMeMyWorth-CoreDB&tls=true`)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const policyId = "7d757d36ce79e19f224fd956aafe078d40f0999f944f36e42491def2";
const collectionSize = 6666;
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

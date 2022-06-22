const mongoose = require("mongoose");
const { insertTokenData } = require("../services/insertTokenData");
const { getTokenPolicyIds } = require("../services/getTokenPolicyIds");
const { getTokenTicker } = require("../services/getTokenTicker");
// const { insertValueOfBestTrait } = require("../services/insertValueOfBestTrait");
const { configSetting } = require('../../config.js')

const database = configSetting()

mongoose.connect(database)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));


// Comment out line once complete!!
async function tokenDataUpdate() {
    const policyIds = await getTokenPolicyIds()
    // policyIdArray = []
    // for (let policyId of policyIds){
    //     policyIdArray.push(policyId.policy_id)
    //     // console.log(policyIds[0].policy_id)
    // }
    // console.log(policyIdArray)

//   const collectionName = await insertUniqueNftProject(policyId, collectionSize, "TellMeMyWorth_Collections");
//   await insertFloorData(collectionName, "TellMeMyWorth_Collections");
    for (let policyId of policyIds){
        console.log(policyId.policy_id)

        let ticker = await getTokenTicker(policyId.policy_id);
        await insertTokenData(policyId.policy_id, ticker);
    }
    mongoose.disconnect();
}

tokenDataUpdate();
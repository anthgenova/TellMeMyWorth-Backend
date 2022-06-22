const mongoose = require('mongoose');
const { getUniqueNftPolicyIds } = require("../services/getUniqueNftPolicyIds");
const { getCollectionSize } = require("../services/getCollectionSize");
const { insertUniqueNftProject } = require("../services/insertUniqueNftProject");
const { insertFloorData } = require("../services/insertFloorData");
const { insertValueOfBestTrait } = require("../services/insertValueOfBestTrait");
const { configSetting } = require('../../config.js')

const database = configSetting()

mongoose.connect(database)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));


// Comment out line once complete!!
async function allUniqueNftDataUpdate(){
    const policyIds = await getUniqueNftPolicyIds()
    policyIdArray = []
    for (let policyId of policyIds){
        policyIdArray.push(policyId.policy_id)
        // console.log(policyIds[0].policy_id)
    }
    console.log(policyIdArray)

    // return Promise.all(

    //  policyIds.map(async policyId => {
    //     const collectionSize = await getCollectionSize(policyId.policy_id, 'TellMeMyWorth_Collections')
    //     console.log(collectionSize)
    //     const collectionName = await insertUniqueNftProject(policyId.policy_id, collectionSize[0].collectionSize, 'TellMeMyWorth_Collections')
    //     await insertFloorData(collectionName, 'TellMeMyWorth_Collections')    
    //     await insertValueOfBestTrait(collectionName, 'TellMeMyWorth_Collections')    
    //     console.log(collectionSize[0].collectionSize)
    // }))

    for (let policyId of policyIds){
        const collectionSize = await getCollectionSize(policyId.policy_id, 'TellMeMyWorth_Collections')
        console.log(collectionSize)
        const collectionName = await insertUniqueNftProject(policyId.policy_id, collectionSize[0].collectionSize, 'TellMeMyWorth_Collections')
        await insertFloorData(collectionName, 'TellMeMyWorth_Collections')    
        await insertValueOfBestTrait(collectionName, 'TellMeMyWorth_Collections')    
    console.log(collectionSize[0].collectionSize)
    }
    mongoose.disconnect();
}

allUniqueNftDataUpdate()
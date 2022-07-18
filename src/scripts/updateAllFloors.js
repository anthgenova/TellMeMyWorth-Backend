const mongoose = require('mongoose');
const { updateAllNftFloors } = require("../services/updateAllNftFloors");
const { updateFloorsData } = require("../services/updateFloorsData");
const { configSetting } = require('../../config.js')

const database = configSetting()

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

async function scheduledUpdateAllFloors(){

console.log(database)
mongoose.connect(database)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));


// Comment out line once complete!!
    await updateFloorsData()
    await updateAllNftFloors()
    // console.log('hi')
    // const policyIds = await getUniqueNftPolicyIds()
    // policyIdArray = []
    // for (let policyId of policyIds){
    //     policyIdArray.push(policyId.policy_id)
    //     // console.log(policyIds[0].policy_id)
    // }
    // console.log(policyIdArray)


    // for (let policyId of policyIds){
    //     const collectionSize = await getCollectionSize(policyId.policy_id, 'TellMeMyWorth_Collections')
    //     console.log(collectionSize)
    //     const collectionName = await insertUniqueNftProject(policyId.policy_id, collectionSize[0].collectionSize, 'TellMeMyWorth_Collections')
    //     await insertFloorData(collectionName, 'TellMeMyWorth_Collections')    
    //     await insertValueOfBestTrait(collectionName, 'TellMeMyWorth_Collections')    
    // console.log(collectionSize[0].collectionSize)
    // }
    await timeout(1800000)
    mongoose.disconnect();
}

scheduledUpdateAllFloors()
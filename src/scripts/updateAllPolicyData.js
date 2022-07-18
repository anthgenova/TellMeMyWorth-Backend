const mongoose = require('mongoose');
const { insertPolicyData } = require("../services/insertPolicyData");
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
    await insertPolicyData()

    await timeout(21600000)

    mongoose.disconnect();

}

scheduledUpdateAllFloors()
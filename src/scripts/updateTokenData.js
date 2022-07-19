const mongoose = require('mongoose');
const { updateTokenData } = require("../services/updateTokenData");
const { configSetting } = require('../../config.js')

const database = configSetting()

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

async function scheduledUpdateTokenData(){

console.log(database)
mongoose.connect(database)
  .then(() => console.log("Connecting to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));


// Comment out line once complete!!
    await updateTokenData()

    await timeout(900000)

    mongoose.disconnect();

}

scheduledUpdateTokenData()
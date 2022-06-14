const mongoose = require("mongoose");
const { insertWalletData } = require("../services/insertWalletData");

mongoose.connect(`mongodb+srv://TellTwan:q23LUx8K0617E5pa@TellMeMyWorth-CoreDB-6341cc4d.mongo.ondigitalocean.com/TellMeMyWorth?authSource=admin&replicaSet=TellMeMyWorth-CoreDB&tls=true`)
    .then(() => console.log('Connecting to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));
// insertWalletData(policyId, database)
// walletAddress     = Wallet address ; can be addr or stake
// database          = database to save to. DEFAULT = 'test'

// Comment out line once complete!!
async function walletDataInsert() {

    await insertWalletData('stake1u9eyn8jyu4m76qqspa0ep2thdn0frnme5s0c4cy8gq0l4hqdpf4w4', 'TellMeMyWorth_Users')
    mongoose.disconnect();
}
walletDataInsert()
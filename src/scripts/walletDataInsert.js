const mongoose = require("mongoose");
const { insertWalletData } = require("../services/insertWalletData");

mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
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
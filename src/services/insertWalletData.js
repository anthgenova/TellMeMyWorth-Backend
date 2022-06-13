const mongoose = require("mongoose");
const { getMyWalletData } = require("../services/getMyWalletData");
const { Wallet } = require("../models/wallet");


async function insertWalletData(walletAddress, database = 'test'){
    // mongoose.connect(`mongodb://localhost/TellMeMyWorth_Users`)
    // mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
    //     .then(() => console.log('Connecting to MongoDB...'))
    //     .catch(err => console.error('Could not connect to MongoDB...', err));

    // Get wallet data from pool.pm. This contains the ADA amount and assets
    const walletData = await getMyWalletData(walletAddress)
    // // Get the index of 'addr'. Used to create the model for the individual wallet
    // const addrIndex = Object.keys(walletData).indexOf('addr')
    // // Get the name of 'addr'. Used to create the model for the individual wallet
    // const walletAddr = await Object.values(walletData)[addrIndex] 
    // // console.log(walletAddr)

    // Creates an Object, Wallet, that is a Class, walletSchema, to correctly store the data to the correct model, modelName.
    // const Wallet = mongoose.model('Wallets', walletSchema, 'Wallets')
    // const Wallet = mongoose.model(walletAddr, walletSchema, walletAddr)
    const wallet = new Wallet(walletData)
    // console.log(wallet)
    

    // Check if wallet addr is already added
    const walletFound = await Wallet
        .find({addr: { $eq:  walletData.addr} })
        .select({ addr: 1})
        .limit(1)

    // If addr has been added then update with current data. If not then addd wallet
    if(walletFound.length > 0 ){
        const updatedPrice = await Wallet.updateOne({ addr : wallet.addr}, {
            $set:{
                addr: wallet.addr,
                itn_reward: wallet.itn_reward,
                lovelaces: wallet.lovelaces,
                pool: wallet.pool,
                reward: wallet.reward,
                synched: wallet.synched,
                tokens: wallet.tokens,
                utxos: wallet.utxos,
                vote_reward: wallet.vote_reward,
                withdrawal: wallet.withdrawal,
                date: Date.now(),
            }
        })
    } else{

    // console.log(walletFound)


    // Save the model to the database
    const result = await wallet.save()
    }


    // mongoose.disconnect();
}
exports.insertWalletData = insertWalletData;

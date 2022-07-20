const mongoose = require("mongoose");
const blockfrost = require("../apiServices/blockfrostApi");
let { bech32 } = require('bech32')

const { getMyWalletData } = require("../services/getMyWalletData");
const { insertMyAssetMetadata } = require("../services/insertMyAssetMetadata");
const { updateMyNftFloors } = require("../services/updateMyNftFloors");
const { Wallet } = require("../models/wallet");

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function decodeAddress(walletAddr){
    const addressWords = bech32.decode(walletAddr, 1000);
    const payload = bech32.fromWords(addressWords.words);
    const addressDecoded = `${Buffer.from(payload).toString('hex')}`;

    const stakeAddressDecoded = 'e1' + addressDecoded.substring(addressDecoded.length - 56);

    return bech32.encode(
        'stake',
        bech32.toWords(Uint8Array.from(Buffer.from(stakeAddressDecoded, 'hex'))),
        1000
    );

}


async function insertWalletData(walletAddr, database = 'test'){
    // console.log(walletAddress)
    let stakeAddr = ''

    // let address = 'addr1qxcvfrgx2vur4hu3pt4tsgz52z9e9rfex4z7qfn96aypfwwh2jfq8qs4q76xtmjn3adhwyyx54uyn0ytywn3d4lxtu4qejvljw'
    if (walletAddr.substring(0, 5) === 'addr1') {
        stakeAddr = await decodeAddress(walletAddr)
    } else if (walletAddr.substring(0, 1) === '$') {
        const handleName = walletAddr.substring(1)
        const policyId = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';

        const assetName = Buffer.from(handleName).toString('hex');

        publicAddr = await blockfrost.getAssetAddress(policyId + assetName)
        // console.log(publicAddr[0].address)
        stakeAddr = await decodeAddress(publicAddr[0].address)
    } else if (walletAddr.substring(0, 5) === 'stake') {
        stakeAddr = walletAddr
    } else {
        return allAssetsReal
    }
    console.log(stakeAddr)

    // mongoose.connect(`mongodb://localhost/TellMeMyWorth_Users`)
    // mongoose.connect(`mongodb+srv://TellTwan:q23LUx8K0617E5pa@TellMeMyWorth-CoreDB-6341cc4d.mongo.ondigitalocean.com/TellMeMyWorth?authSource=admin&replicaSet=TellMeMyWorth-CoreDB&tls=true`)
    //     .then(() => console.log('Connecting to MongoDB...'))
    //     .catch(err => console.error('Could not connect to MongoDB...', err));

    // Get wallet data from pool.pm. This contains the ADA amount and assets
    const walletData = await getMyWalletData(stakeAddr)
    // // Get the index of 'addr'. Used to create the model for the individual wallet
    // const addrIndex = Object.keys(walletData).indexOf('addr')
    // // Get the name of 'addr'. Used to create the model for the individual wallet
    // const walletAddr = await Object.values(walletData)[addrIndex] 
    let walletPolicyIds = []
    // console.log(walletPolicyIds)

    // Creates an Object, Wallet, that is a Class, walletSchema, to correctly store the data to the correct model, modelName.
    // const Wallet = mongoose.model('Wallets', walletSchema, 'Wallets')
    // const Wallet = mongoose.model(walletAddr, walletSchema, walletAddr)
    const wallet = new Wallet(walletData)
    // console.log(wallet)
    // walletData.tokens.forEach(async (token) => {
    //     console.log(walletData.addr)
    //     console.log(token)
    //     // walletPolicyIds.push(token.policy)
    //     // walletPolicyIds.push(token.fingerprint)
    //     // walletPolicyIds.push(token.policy)
    //     await insertMyAssetMetadata(walletData.addr)
    //     await updateMyNftFloors(token.policy, token.fingerprint)        
    // })
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


    // console.log(walletData.addr)

    let iterationIndex = 1
    walletData.tokens.forEach(async (token, index) => {
        await timeout(150 * (index + 1))
        console.log(token)
        // console.log(iterationIndex)
        // if(iterationIndex === 1 ){
        //     iterationIndex = 2
        // } else if(iterationIndex === 2 ){
        //     iterationIndex = 3
        // } else if(iterationIndex === 3 ){
        //     iterationIndex = 1
        // }
        iterationIndex++

        // console.log(walletData.addr)
        // console.log(token)
        // console.log(token.policy)
        // console.log(token.fingerprint)
        // walletPolicyIds.push(token.policy)
        await insertMyAssetMetadata(walletData.addr, token, iterationIndex)
        await updateMyNftFloors(token.policy, token.fingerprint)        
    })
    return walletData.tokens.length

    // await insertMyAssetMetadata(walletData.addr)
    // await updateMyNftFloors(walletPolicyIds)    


    // mongoose.disconnect();
}

insertWalletData('$quackquack')
exports.insertWalletData = insertWalletData;

const mongoose = require("mongoose");
let { bech32 } = require('bech32')
const { Wallet } = require("../models/wallet");
const { PolicyId } = require("../models/policiesTest");
const blockfrost = require("../apiServices/blockfrostApi");
const { nftSchema } = require("../models/schemas/nftSchemaNew");
const { tokenSchema } = require("../models/schemas/tokenSchema");
const { getMyWalletData } = require("../services/getMyWalletData");
const { getFingerprints } = require("../services/getFingerprints");
const { getTokenPolicyIds } = require("../services/getTokenPolicyIds");
//const { getProjectfloorPrice } = require("../services/getProjectfloorPrice");

function twoDecimals(n) {
  let log10 = n ? Math.floor(Math.log10(n)) : 0,
      div = log10 < 0 ? Math.pow(10, 1 - log10) : 100;

  return Math.round(n * div) / div;
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

async function getWalletAssetValues(walletAddr) {
    //     mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
    // .then(() => console.log('Connecting to MongoDB...'))
    // .catch(err => console.error('Could not connect to MongoDB...', err));

    let assets = [];
    let allAssetsReal = []

    let projectDataDb

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
    // console.log(stakeAddr)


    try {
        // Get Wallet Data to find the stake address. this is allow anyone to input their receiving or stake address
        // const walletData = await getMyWalletData(walletAddr);
        // Get the stake address from walletData. this is the addr used in the database
        // const stakeAddr = walletData.addr;

        let assetData = {};
        let projectData = {};


        // console.log(walletData)
        
        // const wallets = await Wallet.find({ addr: stakeAddr }).select({
        const walletData = await Wallet.find({ addr: stakeAddr }).select({
                lovelaces: 1,
                tokens: 1
            // reward: 1,
          });
        // console.log(walletData)
        //   if (wallets.length === 1){
        if (walletData.length === 1){
        assetData["_id"] = stakeAddr;
        projectData["_id"] = stakeAddr;
        projectData["name"] = "ADA";
        assetData["project"] = projectData;
        assetData["asset"] = "ADA";
        // assetData["value"] = twoDecimals(wallets[0].lovelaces / 1000000);
        assetData["value"] = twoDecimals(walletData[0].lovelaces / 1000000);
        assetData["valueBasedOn"] = "";
        assetData["optimized_source"] = "https://cryptologos.cc/logos/cardano-ada-logo.png";
        assetData["assetType"] = "Coin";
        //assetData["floorPrice"] = "";
        allAssetsReal.push(assetData);
        } 
    
        // console.log(walletData.tokens)
        // for (let asset of walletData.tokens) {
        //     console.log(asset)
        // }
        
        // await walletData.tokens.forEach(async asset => {
            for (let asset of walletData[0].tokens) {

            const Nft = mongoose.model(asset.policy, nftSchema, asset.policy);
            // console.log(asset.policy)
            // const assetDataDb = await Nft
            const assetDataDb = await Nft
                .find({fingerprint: asset.fingerprint})
                .select({ onchain_metadata: 1, valueOfBestTrait: 1, bestTrait: 1 })
            // console.log('________________')
            try{
                // console.log(asset.fingerprint)
                // console.log(asset.policy)
                // console.log(assetDataDb[0].onchain_metadata.name)
                // console.log(assetDataDb[0].valueOfBestTrait)
                // console.log(assetData[0].onchain_metadata.name)
                projectDataDb = await PolicyId
                    .find({policies: asset.policy})
                    .select(
                        { 
                        collection_name: 1, 
                        floor: 1, 
                        traitsAreUnique: 1,
                        fungible: 1,
                        metaverse: 1 
                        }
                    )

                assetData = {}
                projectData = {}

                console.log(projectDataDb[0].collection_name)
                console.log(asset.policy)
    
                assetData["_id"] = asset.fingerprint;
                projectData["_id"] = asset.policy;
                // if(projectDataDb[0].collection_name === (null || undefined)){
                //     projectData["name"] = asset.policy;
                // } else {
                projectData["name"] = projectDataDb[0].collection_name;
                // }
                assetData["project"] = projectData;
                assetData["asset"] = assetDataDb[0].onchain_metadata.name;
                if(assetDataDb[0].valueOfBestTrait === 0 || projectDataDb[0].metaverse === true){
                    if (projectDataDb[0].floor === null){
                        assetData["value"] = 0;
                    } else {
                        assetData["value"] = projectDataDb[0].floor;
                    }
                    assetData["valueBasedOn"] = 'Floor'
                } else {
                    assetData["value"] = assetDataDb[0].valueOfBestTrait;
                    assetData["valueBasedOn"] = assetDataDb[0].bestTrait.replace('attributes / ', '')
                      .replace(',undefined' || ', undefined', '')
                      .replace(',' || ', ', ': ')
                      .split(' ')
                      .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                      .join(' ');
                }
                  // assetData["optimized_source"] = "https://storage.googleapis.com/jpeg-optim-files/" + assetDataDb.source;
                  // assetData["optimized_source"] = "https://images.jpgstoreapis.com/" + assetDataDb.source;
                  const CID = require('cids')
                  const cid = new CID(assetDataDb[0].onchain_metadata.image.replace('ipfs/', '').replace('ipfs://', '')).toV1().toString('base32')
                  assetData["optimized_source"] = "https://" + cid +".ipfs.infura-ipfs.io";
                  assetData["assetType"] = "Unique Nft";
                // assetData["floorPrice"] = "";
                
                // console.log(allAssetsReal)
                // console.log(assetData)
                allAssetsReal.push(assetData);
                // console.log(allAssetsReal)
                

                
                // console.log(allAssetsReal)
            } catch (err){
                // console.log(':::::::::::::::::::::')
                // console.log(err)
                // console.log(projectDataDb)
            }
            // allAssetsReal.push(assetData);

            
            // console.log(allAssetsReal)
            // console.log(assetData)
        }
        // console.log(allAssetsReal)
        // console.log(walletData.tokens)

/*
    const fingerprints = await getFingerprints(stakeAddr);

    const tokenPolicyIds = await getTokenPolicyIds()

    let tokenPolicyIdList = []
    tokenPolicyIds.forEach((tokenPolicyId) =>
      tokenPolicyIdList.push(tokenPolicyId.policy_id)
    )
      console.log(tokenPolicyIdList)

    // Create object to store the wallet's asset values in
    let allAssets = {};
    // let allAssetsReal = []
    let assetData = {};
    let projectData = {};

    // const Wallet = mongoose.model("Wallets", walletSchema, "Wallets");
    const wallets = await Wallet.find({ addr: stakeAddr }).select({
      lovelaces: 1,
      reward: 1,
    });
    allAssets["ada"] = wallets[0].lovelaces / 1000000;

    assetData["_id"] = walletAddr;
    projectData["_id"] = walletAddr;
    projectData["name"] = "ADA";
    assetData["project"] = projectData;
    assetData["asset"] = "ADA";
    assetData["value"] = twoDecimals(wallets[0].lovelaces / 1000000);
    assetData["valueBasedOn"] = "";
    assetData["optimized_source"] = "https://cryptologos.cc/logos/cardano-ada-logo.png";
    assetData["assetType"] = "Coin";
    //assetData["floorPrice"] = "";
    allAssetsReal.push(assetData);

    allAssets["lifetimeReward"] = wallets[0].reward / 1000000;

    for (let fingerprint in fingerprints) {
      // Create the Model name in the correct format to querry MongoDb
      let collectionModel = await fingerprint.replaceAll(" ", "_");
      console.log('FINGERPRINT' + collectionModel)

      if(collectionModel.includes('Token')){
        // console.log('MADE IT HERE',`'${collectionModel}'`)

        let lengthOfProjectName = collectionModel.indexOf('_Token')
        // console.log(lengthOfProjectName)
        // collectionModel = collectionModel.substring(0, lengthOfProjectName).toUpperCase() + '_Token'
        collectionModel = collectionModel.substring(0, lengthOfProjectName) + '_Token'

        // console.log(collectionModel)
      }

      // Check if the first letter in collectionModel is an uppercase letter.
      // policyIds are made up of numbers and lowercase, so this checks to make sure it is an actual collection in Mongo
      let firstLetter = collectionModel.charAt(0);
      if (firstLetter == firstLetter.toUpperCase() && isNaN(firstLetter * 1) && !collectionModel.includes('Token')) {

        const Nft = mongoose.model(
          `${collectionModel}`,
          nftSchema,
          `${collectionModel}`
        );
        console.log(fingerprints[fingerprint].assets)

        // console.log(fingerprints[fingerprint])
        const nfts = await Nft.find({
          fingerprint: { $in: fingerprints[fingerprint].assets },
        }).select({
          valueOfBestTrait: 1,
          bestTrait: 1,
          fingerprint: 1,
          display_name: 1,
          policy_id: 1,
          source: 1,
        });

        if(collectionModel === 'HOSKY_Token') console.log('HOSKY', (fingerprint))


        // Create object to store each nft with their suggested value
        let assetBestTrait = {};

        // Tries to open the model for the collection. Will work if it is in the Database, if not it skips this policId
        try {
          nfts.forEach((element) => {
            assetData = {};
            let projectData = {};

            // console.log(`>>>>>>>>>>>>>>>>>> ${element.policy_id}`)


            // let floorPrice = await getProjectfloorPrice(element.policy_id);

            console.log("element", element);
            // console.log(element.valueOfBestTrait)
            assetBestTrait[element.display_name] =
              element.valueOfBestTrait / 1000000;

            assetData["_id"] = element.fingerprint;
            projectData["_id"] = element.policy_id;
            projectData["name"] = collectionModel.replaceAll("_", " ");
            assetData["project"] = projectData;
            assetData["asset"] = element.display_name;
            assetData["value"] = element.valueOfBestTrait / 1000000;
            assetData["valueBasedOn"] = element.bestTrait.replace('attributes / ', '')
              .replace(',undefined' || ', undefined', '')
              .replace(',' || ', ', ': ')
              .split(' ')
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ');
              // assetData["optimized_source"] = "https://storage.googleapis.com/jpeg-optim-files/" + element.source;
              // assetData["optimized_source"] = "https://images.jpgstoreapis.com/" + element.source;
              const CID = require('cids')
              const cid = new CID(element.source).toV1().toString('base32')
              assetData["optimized_source"] = "https://" + cid +".ipfs.infura-ipfs.io";
              assetData["assetType"] = "Unique Nft";
            // assetData["floorPrice"] = "";
            allAssetsReal.push(assetData);
          });
        } catch {}
        if (Object.values(assetBestTrait).length > 0) {
          allAssets[collectionModel.replaceAll("_", " ")] = assetBestTrait;
        }

        
        
        
      // } else if (firstLetter == firstLetter.toUpperCase() && isNaN(firstLetter * 1) && collectionModel.includes('Token')) {
      } else if (collectionModel.includes('Token')) {
        try{
        // console.log(Boolean(Nft))
          if(collectionModel.includes('Token')){
            console.log('MADE IT HERE',`'${collectionModel}'`)

            // const tokenSchem = new mongoose.Schema(
            //   {
            //     policy_id: { type: String, default: " " },
            //     asset_name: { type: String, default: " " },
            //     valueOfToken: { type: Number, default: 0 },
            //     traitsAreUnique: { type: Boolean, default: true },
            //     optimized_source: { type: String, default: " " },
            //     date: { type: Date, default: Date.now },
            //   },
            // );
            

            const Token = mongoose.model(
              `${collectionModel}`,
              tokenSchema,
              `${collectionModel}`
            );
    
            console.log(Token)
    
            // const Token = mongoose.model(
            //   `${collectionModel}`,
            //   tokenSchema,
            //   `${collectionModel}`
            //   );
              
              // console.log('ALSO MADE IT HERE',Token)
              const token = await Token.find({
                policy_id: {$in: tokenPolicyIdList}
              })
              .select({
                  policy_id: 1,
                  valueOfToken: 1,
                  tokenValueMultiplier: 1,
                });
                // console.log('token',token)
                
                // try {
                  assetData = {};
                  let projectData = {};

                  // let floorPrice = await getProjectfloorPrice(token[0].policy_id);

                  let tokenQuantity = fingerprints[fingerprint].quantity / Math.pow(10, (fingerprints[fingerprint].decimals))
                  let tokenValue = (token[0].valueOfToken * token[0].tokenValueMultiplier)
                  let value = ( tokenValue * tokenQuantity)
                  // console.log(value)
                  // let valueArray = Array.from
                  // let valueLength = value.lastIndexOf(0)
                  if(value > .01){
                    assetData["_id"] = token[0].policy_id;
                    projectData["_id"] = token[0].policy_id;
                    projectData["name"] = collectionModel.replaceAll("_", " ");
                    assetData["project"] = projectData;
                    assetData["asset"] = collectionModel.replaceAll("_", " ");
                    
                    // assetData["value"] = ((token[0].valueOfToken * token[0].tokenValueMultiplier) * fingerprints[fingerprint].quantity);
                    assetData["value"] = twoDecimals(value);
                    // assetData["valueBasedOn"] = `${fingerprints[fingerprint].quantity} ${collectionModel.replaceAll("_", " ").replaceAll("Token", "")} @ ${(token[0].valueOfToken * token[0].tokenValueMultiplier).toLocaleString("en-US")} ₳`;
                    assetData["valueBasedOn"] = `${twoDecimals(tokenQuantity)} ${collectionModel.replaceAll("_", " ").replaceAll("Token", "")} @ ${(twoDecimals(tokenValue))} ₳`;
                    assetData["optimized_source"] = `https://pool.pm/registry/${token[0].policy_id}/${collectionModel.replaceAll("_", "").replaceAll("Token", "")}/logo.png`;
                    // console.log('policyId',token[0].policy_id)
                    assetData["assetType"] = "Token";
                    // assetData["floorPrice"] = floorPrice;

                    allAssetsReal.push(assetData);
                  }
                }
        } catch {}
        console.log('TOKEN')
      }


      
    }  
    

*/
  } catch {}



//   console.log(allAssetsReal)

//   console.log(allAssetsReal);
  return allAssetsReal;
}
// getWalletAssetValues('take1uyx0wny64r8tvdp2khw3h9kfqpznee8f0v2774zsunmp5cgsy3503')

exports.getWalletAssetValues = getWalletAssetValues;

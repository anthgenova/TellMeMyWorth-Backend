const mongoose = require("mongoose");
const { Wallet } = require("../models/wallet");
const { nftSchema } = require("../models/schemas/nftSchema");
const { tokenSchema } = require("../models/schemas/tokenSchema");
const { getMyWalletData } = require("../services/getMyWalletData");
const { getFingerprints } = require("../services/getFingerprints");
const { getTokenPolicyIds } = require("../services/getTokenPolicyIds");

function twoDecimals(n) {
  let log10 = n ? Math.floor(Math.log10(n)) : 0,
      div = log10 < 0 ? Math.pow(10, 1 - log10) : 100;

  return Math.round(n * div) / div;
}

async function getWalletAssetValues(walletAddr) {
  let allAssetsReal = [];
  try {
    // Get Wallet Data to find the stake address. this is allow anyone to input their receiving or stake address
    const walletData = await getMyWalletData(walletAddr);
    // Get the stake address from walletData. this is the addr used in the database
    const stakeAddr = walletData.addr;

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
              assetData["optimized_source"] = "https://storage.googleapis.com/jpeg-optim-files/" + element.source;
              assetData["assetType"] = "Unique Nft";
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

                    allAssetsReal.push(assetData);
                  }
                }
        } catch {}
        console.log('TOKEN')
      }


      
    }  
    


  } catch {}
  console.log(allAssetsReal);
  return allAssetsReal;
}

exports.getWalletAssetValues = getWalletAssetValues;

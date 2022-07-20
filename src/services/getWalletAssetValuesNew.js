const mongoose = require("mongoose");
let { bech32 } = require('bech32')
const CID = require('cids')
const { Wallet } = require("../models/wallet");
const { PolicyId } = require("../models/policiesTest");
const { Token } = require("../models/tokens");
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
    //   mongoose.connect(`mongodb+srv://TellTwan:q23LUx8K0617E5pa@TellMeMyWorth-CoreDB-6341cc4d.mongo.ondigitalocean.com/TellMeMyWorth?authSource=admin&replicaSet=TellMeMyWorth-CoreDB&tls=true`)
    //       .then(() => console.log('Connecting to MongoDB...'))
    //       .catch(err => console.error('Could not connect to MongoDB...', err));
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


        // console.log(stakeAddr)
        
        // const wallets = await Wallet.find({ addr: stakeAddr }).select({
        const walletData = await Wallet.find({ addr: stakeAddr }).select({
                lovelaces: 1,
                tokens: 1
            // reward: 1,
          });
        
        let assetPoliciesAndFingerprintsFound = {}
        walletData[0].tokens.forEach(token =>{
            // console.log(token.fingerprint)
            // console.log(token.policy)
            if(!assetPoliciesAndFingerprintsFound[token.policy]){
                assetPoliciesAndFingerprintsFound[token.policy] = []
            }
            assetPoliciesAndFingerprintsFound[token.policy].push([token.fingerprint, token.quantity, token.decimals, token.name])
            // console.log(token)
        })
        // console.log((assetPoliciesAndFingerprintsFound))
    
    
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

    
        const myTokens = await Token.find({
            policy_id: {$in: Object.keys(assetPoliciesAndFingerprintsFound)},
            show: true
          })
          .select({
              policy_id: 1,
              asset_name: 1,
              valueOfToken: 1,
              tokenValueMultiplier: 1,
            });



        console.log(myTokens)
        let tokenPoliciesUsed = []
        for(const myToken of myTokens){
            assetData = {};
            let projectData = {};


            // console.log(walletData[0].tokens)
            console.log(myToken)
            // console.log(assetPoliciesAndFingerprintsFound[myToken.policy_id][0][1])
            const quantity = assetPoliciesAndFingerprintsFound[myToken.policy_id][0][1]
            let decimals = 0
            // console.log('*******************')
            // console.log(myToken)
            try {
             decimals = assetPoliciesAndFingerprintsFound[myToken.policy_id][0][2]
             if( decimals === undefined || decimals === 'undefined' || decimals === null || !Boolean(decimals)){
                 decimals = 0
                 console.log(decimals)
                }
            } catch{
                // const decimals = 0
            }
            // console.log(decimals)
            // let floorPrice = await getProjectfloorPrice(token[0].policy_id);

            let tokenQuantity = quantity / Math.pow(10, (decimals))
            let tokenValue = (myToken.valueOfToken * myToken.tokenValueMultiplier)
            // console.log(tokenValue)
            let value = ( tokenValue * tokenQuantity)
            // console.log(value)
            // // let valueArray = Array.from
            // // let valueLength = value.lastIndexOf(0)
            if(value > .01){
              assetData["_id"] = myToken.policy_id;
              projectData["_id"] = myToken.policy_id;
              projectData["name"] = myToken.asset_name;
              assetData["project"] = projectData;
              assetData["asset"] = myToken.asset_name;
              
              // assetData["value"] = ((myToken.valueOfToken * myToken.tokenValueMultiplier) * fingerprints[fingerprint].quantity);
              assetData["value"] = twoDecimals(value);
              // assetData["valueBasedOn"] = `${fingerprints[fingerprint].quantity} ${collectionModel.replaceAll("_", " ").replaceAll("Token", "")} @ ${(myToken.valueOfToken * myToken.tokenValueMultiplier).toLocaleString("en-US")} ₳`;
              assetData["valueBasedOn"] = `${twoDecimals(tokenQuantity)} ${myToken.asset_name} @ ${(twoDecimals(tokenValue))} ₳`;
              //assetData["optimized_source"] = `https://pool.pm/registry/${myToken.policy_id}/${collectionModel.replaceAll("_", "").replaceAll("Token", "")}/logo.png`;
              // console.log('policyId',token[0].policy_id)
              assetData["assetType"] = "Token";
              // assetData["floorPrice"] = floorPrice;
// console.log(assetData)
              allAssetsReal.push(assetData);
                
              tokenPoliciesUsed.push(myToken.policy_id)
            }
            
        }
        delete assetPoliciesAndFingerprintsFound[tokenPoliciesUsed]
        // console.log(Object.keys(assetPoliciesAndFingerprintsFound))

        projectDataDb = await PolicyId
            .find({policies: {$in: Object.keys(assetPoliciesAndFingerprintsFound)}})
            .select(
                { 
                    policies: 1,
                    collection_name: 1, 
                    floor: 1, 
                    metaverse: 1 
                }
            )
        let projectList = {}
        projectDataDb.forEach(project =>{
            // console.log(project)
            projectList[project.policies] = [project.collection_name, project.metaverse, project.floor]
        })
        console.log(projectList)


        
        // await walletData.tokens.forEach(async asset => {
            console.log(Object.keys(assetPoliciesAndFingerprintsFound))
            for (let collection of Object.keys(assetPoliciesAndFingerprintsFound)) {
                try{
                console.log(collection)
                // console.log(assetPoliciesAndFingerprintsFound[collection])

                let collectionFingerprints = []

                assetPoliciesAndFingerprintsFound[collection].forEach(fingerprint => {
                    collectionFingerprints.push(fingerprint[0])
                })
                // console.log(collectionFingerprints)

                // try{
                const Nft = mongoose.model(collection, nftSchema, collection);

                const assetDataDb = await Nft
                    .find({fingerprint: {$in: collectionFingerprints}})
                    .select({ onchain_metadata: 1, valueOfBestTrait: 1, bestTrait: 1, fingerprint: 1 })
                for(let asset of assetDataDb){
                        // console.log('----------------------------')
                        // try{
                                            console.log(assetDataDb[0].valueOfBestTrait)
                        // } catch{}
                    assetData = {}
                    projectData = {}
    
                    assetData["_id"] = asset.fingerprint;
                    projectData["_id"] = collection;
                    projectData["name"] = projectList[collection][0];
                    assetData["project"] = projectData;
                    try{
                        assetData["asset"] = asset.onchain_metadata.name;
                    } catch {
                        assetData["asset"] = asset.fingerprint;
                    }

                    if(assetDataDb[0].valueOfBestTrait === 0 || projectList[collection][1] === true ){
                        if (projectList[collection][2] === null){
                            assetData["value"] = 0;
                        } else {
                            assetData["value"] = projectList[collection][2];
                        }
                        assetData["valueBasedOn"] = 'Floor'
                    } else if (assetDataDb[0].valueOfBestTrait === projectList[collection][2]){
                        assetData["value"] = projectList[collection][2];
                        assetData["valueBasedOn"] = 'Floor'
                    } else {
                        assetData["value"] = asset.valueOfBestTrait;
                        assetData["valueBasedOn"] = asset.bestTrait.replace('attributes / ', '')
                            .replace(',undefined' || ', undefined', '')
                            .replace(',' || ', ', ': ')
                            .split(' ')
                            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                            .join(' ');
                    }

                    try{
                        const cid = new CID(asset.onchain_metadata.image.replace('ipfs/', '').replace('ipfs://', '')).toV1().toString('base32')
                        assetData["optimized_source"] = "https://" + cid +".ipfs.infura-ipfs.io";
                    } catch{}
                    assetData["assetType"] = "Nft";
                    allAssetsReal.push(assetData);







                }
                    /*
                console.log(assetDataDb)

    
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
    
                /*
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

            */
        } catch (err){
            console.log(err)
        }
        }  
        // console.log(allAssetsReal)
  


  } catch {}



//   console.log(allAssetsReal)

//   console.log(allAssetsReal);
  return allAssetsReal;
}
// getWalletAssetValues('$lifesgood')

exports.getWalletAssetValues = getWalletAssetValues;

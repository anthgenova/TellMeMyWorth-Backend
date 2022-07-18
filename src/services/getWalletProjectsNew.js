const mongoose = require("mongoose");
const blockfrost = require("../apiServices/blockfrostApi");
let { bech32 } = require('bech32')

const { getMyWalletData } = require("../services/getMyWalletData");
const { getFingerprints } = require("../services/getFingerprints");
// const { nftSchema } = require("../models/schemas/nftSchema");
const { PolicyId } = require("../models/policiesTest");
const { Wallet } = require("../models/wallet");


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

async function getWalletProjects(walletAddr) {
    // mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
    // .then(() => console.log('Connecting to MongoDB...'))
    // .catch(err => console.error('Could not connect to MongoDB...', err));
    let stakeAddr = ''

    // let address = 'addr1qxcvfrgx2vur4hu3pt4tsgz52z9e9rfex4z7qfn96aypfwwh2jfq8qs4q76xtmjn3adhwyyx54uyn0ytywn3d4lxtu4qejvljw'
    if (walletAddr.substring(0, 5) === 'addr1') {
        stakeAddr = await decodeAddress(walletAddr)
    } else if (walletAddr.substring(0, 1) === '$') {
        const handleName = walletAddr.substring(1)
        const policyId = 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a';

        const assetName = Buffer.from(handleName).toString('hex');

        publicAddr = await blockfrost.getAssetAddress(policyId + assetName)
        console.log('----------------')
        console.log(publicAddr)
        // console.log(publicAddr[0].address)
        stakeAddr = await decodeAddress(publicAddr[0].address)
    } else if (walletAddr.substring(0, 5) === 'stake') {
        stakeAddr = walletAddr
    } else {
        return allAssetsReal
    }
    console.log(stakeAddr)

  
  let projects = [];
  try {
    // Get Wallet Data to find the stake address. this is allow anyone to input their receiving or stake address
    // const walletData = await getMyWalletData(walletAddr);
    // Get the stake address from walletData. this is the addr used in the database
    // const stakeAddr = walletData.addr;
    // console.log(stakeAddr)
    // console.log(walletData)
    const walletData = await Wallet.find({ addr: stakeAddr }).select({
        tokens: 1
    // reward: 1,
    });

    // console.log('[[[[[[[[[[[[[[[[[[[')
    // console.log(walletData)

    let policyArray = []
    walletData[0].tokens.forEach(policy => {
        // console.log(policy)
        policyArray.push(policy['policy'])
    })
    // console.log('[[[[[[[[[[[[[[[[[[[')
    // console.log(policyArray)

    // const Nft = mongoose.model(floor.policy_id, nftSchema, floor.policy_id);

    // console.log(floor.trait_floors)
    let projectData = {};

    // projectData["_id"] = walletAddr;
    projectData["_id"] = stakeAddr;
    projectData["name"] = "ADA";
    // console.log()
    projects.push(projectData);

    const projectsData = await PolicyId
        .find({policies: {$in: policyArray}})
        .select({ collection_name: 1, floor: 1, policies: 1 })

    projectsData.forEach(project => {
        if((project.policies !== project.collection_name) && project.collection_name !== null){
            // console.log(project)
            // console.log(project.collection_name)
            projectData = {};
            projectData["_id"] = project.policies;
            projectData["name"] = project.collection_name;
            projects.push(projectData);
        
        }
    })



    projects.sort((a, b) => a.name.localeCompare(b.name));

    // console.log(projects)
/*
    const fingerprints = await getFingerprints(stakeAddr);
    // console.log(fingerprints)

    // Create object to store the wallet's asset values in
    let allAssets = {};
    // let projects = []
    let assetData = {};
    let projectData = {};

    projectData["_id"] = walletAddr;
    projectData["name"] = "ADA";
    projects.push(projectData);

    for (let fingerprint in fingerprints) {
      // Create the Model name in the correct format to querry MongoDb
      const collectionModel = await fingerprint.replaceAll(" ", "_");
      // console.log(collectionModel)

      

      // Check if the first letter in collectionModel is an uppercase letter.
      // policyIds are made up of numbers and lowercase, so this checks to make sure it is an actual collection in Mongo
      let firstLetter = collectionModel.charAt(0);
      if (firstLetter == firstLetter.toUpperCase() && isNaN(firstLetter * 1) && !collectionModel.includes('Token')) {
        // console.log(collectionModel)
        const Nft = mongoose.model(
          `${collectionModel}`,
          nftSchema,
          `${collectionModel}`
        );

        const nfts = await Nft.find({
          fingerprint: { $in: fingerprints[fingerprint].assets },
        }).select({ policy_id: 1 });

        // console.log(fingerprints[fingerprint].assets)


        // Create object to store each nft with their suggested value
        let assetBestTrait = {};
        projectData = {};
        // Tries to open the model for the collection. Will work if it is in the Database, if not it skips this policId
        try {
          nfts.forEach((element) => {
            assetData = {};

            // console.log('element',element)
            // console.log(element.valueOfBestTrait)
            assetBestTrait[element.display_name] =
              element.valueOfBestTrait / 1000000;

            // assetData['assetId'] = element.fingerprint
            projectData["_id"] = element.policy_id;
            projectData["name"] = collectionModel.replaceAll("_", " ");
            // assetData['project'] = projectData
            // assetData['assetName'] = element.display_name
            // assetData['value'] = element.valueOfBestTrait / 1000000
            console.log("element", projectData);

            if (!projects.some((e) => e._id === projectData["_id"])) {
              projects.push(projectData);
            }
          });
          // console.log(nfts[0].valueOfBestTrait)
        } catch {}
        // console.log(Object.values(assetBestTrait).length)
        if (Object.values(assetBestTrait).length > 0) {
          allAssets[collectionModel.replaceAll("_", " ")] = assetBestTrait;
        }
      }
    }

    projects.sort((a, b) => a.name.localeCompare(b.name));
*/
} catch {
    // projects.push("Not Found")
  }
  // mongoose.disconnect();
  // console.log('HHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH',projects);
  return projects;
}
// getWalletProjects('stake1u8nlkz48sph4mtcddes4k2kdw776qcvszrqpvxuyy2jsn0s2hf7yp')
exports.getWalletProjects = getWalletProjects;

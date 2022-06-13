const mongoose = require("mongoose");
const { getMyWalletData } = require("../services/getMyWalletData");
const { getFingerprints } = require("../services/getFingerprints");
const { nftSchema } = require("../models/schemas/nftSchema");

async function getWalletProjects(walletAddr) {
  let projects = [];
  try {
    // Get Wallet Data to find the stake address. this is allow anyone to input their receiving or stake address
    const walletData = await getMyWalletData(walletAddr);
    // Get the stake address from walletData. this is the addr used in the database
    const stakeAddr = walletData.addr;
    // console.log(stakeAddr)

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
      if (firstLetter == firstLetter.toUpperCase() && isNaN(firstLetter * 1)) {
        const Nft = mongoose.model(
          `${collectionModel}`,
          nftSchema,
          `${collectionModel}`
        );
        console.log(Nft)

        const nfts = await Nft.find({
          fingerprint: { $in: fingerprints[fingerprint] },
        }).select({ policy_id: 1 });

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
  } catch {
    // projects.push("Not Found")
  }
  // mongoose.disconnect();
  console.log(projects);
  return projects;
}

exports.getWalletProjects = getWalletProjects;

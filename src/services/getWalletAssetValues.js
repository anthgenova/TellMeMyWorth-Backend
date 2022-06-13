const mongoose = require("mongoose");
const { Wallet } = require("../models/wallet");
const { nftSchema } = require("../models/schemas/nftSchema");
const { getMyWalletData } = require("../services/getMyWalletData");
const { getFingerprints } = require("../services/getFingerprints");

async function getWalletAssetValues(walletAddr) {
  let allAssetsReal = [];
  try {
    // Get Wallet Data to find the stake address. this is allow anyone to input their receiving or stake address
    const walletData = await getMyWalletData(walletAddr);
    // Get the stake address from walletData. this is the addr used in the database
    const stakeAddr = walletData.addr;

    const fingerprints = await getFingerprints(stakeAddr);

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
    assetData["value"] = wallets[0].lovelaces / 1000000;
    assetData["bestTrait"] = "";
    assetData["optimized_source"] = "https://cryptologos.cc/logos/cardano-ada-logo.png";
    allAssetsReal.push(assetData);

    allAssets["lifetimeReward"] = wallets[0].reward / 1000000;

    for (let fingerprint in fingerprints) {
      // Create the Model name in the correct format to querry MongoDb
      const collectionModel = await fingerprint.replaceAll(" ", "_");
      console.log(collectionModel)

      // Check if the first letter in collectionModel is an uppercase letter.
      // policyIds are made up of numbers and lowercase, so this checks to make sure it is an actual collection in Mongo
      let firstLetter = collectionModel.charAt(0);
      if (firstLetter == firstLetter.toUpperCase() && isNaN(firstLetter * 1)) {
        const Nft = mongoose.model(
          `${collectionModel}`,
          nftSchema,
          `${collectionModel}`
        );
        const nfts = await Nft.find({
          fingerprint: { $in: fingerprints[fingerprint] },
        }).select({
          valueOfBestTrait: 1,
          bestTrait: 1,
          fingerprint: 1,
          display_name: 1,
          policy_id: 1,
          source: 1,
        });

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
            assetData["bestTrait"] = element.bestTrait.replace('attributes / ', '')
              .replace(',' || ', ', ': ')
              .split(' ')
              .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
              .join(' ');
            assetData["optimized_source"] = "https://storage.googleapis.com/jpeg-optim-files/" + element.source;
            allAssetsReal.push(assetData);
          });
        } catch {}
        if (Object.values(assetBestTrait).length > 0) {
          allAssets[collectionModel.replaceAll("_", " ")] = assetBestTrait;
        }
      }
    }
  } catch {}
  console.log(allAssetsReal);
  return allAssetsReal;
}

exports.getWalletAssetValues = getWalletAssetValues;

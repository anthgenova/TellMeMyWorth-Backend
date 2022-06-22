const mongoose = require("mongoose");
const { getTokenPrice } = require("../services/getTokenPrice");
// const { getCollectionName } = require("../services/getCollectionName");
const { PolicyId } = require("../models/policyId");
const { tokenSchema } = require("../models/schemas/tokenSchema");

async function insertTokenData(policyId, ticker, multiplier = .000001) {
//       mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
//   .then(() => console.log('Connecting to MongoDB...'))
//   .catch(err => console.error('Could not connect to MongoDB...', err));

  const tokenPrice = await getTokenPrice(policyId, ticker);
  // Gets the size of the collection. Index 16 is collections from jpg.store api
  // getCollectionData index [0] to get rid of fluff
  // const getCollectionSize = await Object.values(getCollectionData[0])[collectionsIndex].supply
  // Gets the name of the collection to use as model name. Index 16 is collections from jpg.store api
//   const getCollectionName = await Object.values(getCollectionData[0])[
//     collectionsIndex
//   ].display_name;
//   // Replace spaces with underscores
//   const collectionName = await getCollectionName.replaceAll(" ", "_");

  // Creates an Object, PolicyId, that is a Class, policyIdSchema, to correctly store the data to the correct model, 'Policy_Ids'.
  // const PolicyId = mongoose.model('Policy_Ids', policyIdSchema, 'Policy_Ids')

  // Find the policyId form the API call to jpg.store in the PolicyIds model
  const policyIdFound = await PolicyId.find({ policy_id: { $eq: policyId } })
    .select({ policy_id: 1 })
    .limit(1);

  // If the policyId isn't in the Policy_Ids model then add it
  if (!(policyIdFound.length > 0)) {
    const idData = {
      policy_id: policyId,
      display_name: `${ticker} Token`,
      traitsAreUnique: false,
      fungible: true,
      metaverse: false,
      collectionSize: 0,
    };

    const ID = new PolicyId(idData);
    // console.log(ID)
    await ID.save();
  }

//   const collectionName = await ticker.toUpperCase().replaceAll(" ", "_");
  const collectionName = await ticker.replaceAll(" ", "_");


  // Creates an Object, Nft, that is a Class, nftSchema, to correctly store the data to the correct model, modelName.
  const Token = mongoose.model(`${collectionName}_Token`, tokenSchema, `${collectionName}_Token`);

  const token = new Token({  
    policy_id: policyId,
    // asset_name: `${ticker.toUpperCase()} Token`,
    asset_name: `${ticker} Token`,
    valueOfToken: tokenPrice,
    tokenValueMultiplier: multiplier,
    traitsAreUnique: false,
    optimized_source:  "",
    date: Date.now(),
  });

  const tokenFound = await Token.find({
    policy_id: { $eq: policyId },
  })
    .select({ fingerprint: 1 })
    .limit(1);

    if (tokenFound.length > 0) {
        const updatedPrice = await Token.updateMany({}, {
            $set: {
            //   policy_id: token.policy_id,
            //   asset_name: token.asset_name,
              valueOfToken: token.valueOfToken,
            //   traitsAreUnique: token.traitsAreUnique,
              date: Date.now(),
            }  
        });
    } else {
        const result = await token.save();
    }

    // mongoose.disconnect();
//   return collectionName;
}

// insertTokenData('a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235', 'HOSKY')

exports.insertTokenData = insertTokenData;

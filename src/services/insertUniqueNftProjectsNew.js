const mongoose = require("mongoose");
const { getNftData } = require("../services/getNftData");
const blockfrost = require("../apiServices/blockfrostApi");
// const { getCollectionName } = require("../services/getCollectionName");
const { PolicyId } = require("../models/policiesTest");
// const { Nft } = require("../models/nfts");
const { nftSchema } = require("../models/schemas/nftSchemaNew");



function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function insertUniqueNftProject(policyId) {
//   mongoose.connect(`mongodb://localhost/TellMeMyWorth_Collections`)
  // mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
  //     .then(() => console.log('Connecting to MongoDB...'))
  //     .catch(err => console.error('Could not connect to MongoDB...', err));

    let assetNames = await blockfrost.getNftNames(policyId)
    console.log(assetNames)

    assetNames.forEach(async (assetName, index) => {
            await timeout(100 * (index + 1))
            let assetData = await blockfrost.getAssetMetadata(assetName.asset)
            // console.log(assetData)
            console.log(assetData.policy_id)

            // const ID = new PolicyId(assetData.policy_id);
            // console.log( ID)
              // await ID.save()
      
              const collectionName = await PolicyId.find({
                policies: assetData.policy_id ,
              })
                .select({ collection_name: 1 })
                .limit(1);
      
                console.log(collectionName)

            const Nft = mongoose.model(`${collectionName[0].collection_name.replaceAll(' ', '_')}_New`, nftSchema, `${collectionName[0].collection_name.replaceAll(' ', '_')}_New`);


            const nftData = new Nft({
                asset: assetData.asset,
                policy_id: assetData.policy_id,
                asset_name: assetData.asset_name,
                fingerprint: assetData.fingerprint,
                quantity: assetData.quantity,
                onchain_metadata: assetData.onchain_metadata,
            });

            nftData.save()
      })
/*
  // Get the size of a collection
  const getCollectionData = await getNftData(policyId, 1);
  // Get the index of 'collections'
  const collectionsIndex = Object.keys(getCollectionData[0]).indexOf(
    "collections"
  );
  // Gets the size of the collection. Index 16 is collections from jpg.store api
  // getCollectionData index [0] to get rid of fluff
  // const getCollectionSize = await Object.values(getCollectionData[0])[collectionsIndex].supply
  // Gets the name of the collection to use as model name. Index 16 is collections from jpg.store api
  const getCollectionName = await Object.values(getCollectionData[0])[
    collectionsIndex
  ].display_name;
  // Replace spaces with underscores
  const collectionName = await getCollectionName.replaceAll(" ", "_");

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
      display_name: getCollectionName,
      traitsAreUnique: true,
      fungible: false,
      metaverse: false,
      collectionSize: collectionSize,
    };

    const ID = new PolicyId(idData);
    await ID.save();
  }

  // Creates an Object, Nft, that is a Class, nftSchema, to correctly store the data to the correct model, modelName.
  const Nft = mongoose.model(collectionName, nftSchema, collectionName);

  // Calls the function getNftData and inputs the policyId and size to grab the nft collection from jpg.store
  const nftData = await getNftData(policyId, collectionSize);
  // const nftData = await getNftData(policyId, getCollectionSize)
  // console.log(nftData)

  // Runs through each individual nft in individualNft to save the data to MongoDb
  let i = 0;
  for (individualNft of nftData) {
    const nft = new Nft(individualNft);
    console.log(nft);

    const nftFound = await Nft.find({
      fingerprint: { $eq: individualNft.fingerprint },
    })
      .select({ fingerprint: 1 })
      .limit(1);

    // console.log(nft)
    // Checks if the nft has already been added. Updates if true, inserts if false
    if (nftFound.length > 0) {
      const updatedPrice = await Nft.updateOne(
        { fingerprint: individualNft.fingerprint },
        {
          $set: {
            listed_at: nft.listed_at,
            traits: nft.traits,
            quantity: nft.quantity,
            policy_id: nft.policy_id,
            initial_mint_tx_hash: nft.initial_mint_tx_hash,
            has_pending_transaction: nft.has_pending_transaction,
            last_sale_lovelace: nft.last_sale_lovelace,
            listing_lovelace: nft.listing_lovelace,
            created_at: nft.created_at,
            _meta: nft._meta,
            source: nft.source,
            asset_id: nft.asset_id,
            display_name: nft.display_name,
            listings: nft.listings,
            optimized_source: nft.optimized_source,
            asset_name: nft.asset_name,
            collections: nft.collections,
            fingerprint: nft.fingerprint,
            asset_num: nft.asset_num,
            mediatype: nft.mediatype,
            likes: nft.likes,
            is_taken_down: nft.is_taken_down,
            date: Date.now(),
          },
        }
      );
      //console.log(updatedPrice)
    } else {
      // console.log(nft)
      // console.log('NOT Found')
      const result = await nft.save();
    }
    // console.log(i++)
    //console.log(Object.values(individualNft)[16].supply)
  }
  //console.log(result)
  //mongoose.disconnect();
  return collectionName;
  */
}
// insertUniqueNftProject('94da605878403d07c144fe96cd50fe20c16186dd8d171c78ed6a8768')
exports.insertUniqueNftProject = insertUniqueNftProject;

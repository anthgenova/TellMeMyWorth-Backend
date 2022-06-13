const mongoose = require("mongoose");
const { nftSchema } = require("../models/schemas/nftSchema");
const { traitFloorSchema } = require("../models/schemas/traitFloorSchema");

async function insertFloorData(collectionModel, database = "test") {
  const Collection = mongoose.model(
    collectionModel,
    nftSchema,
    collectionModel
  );

  // Querries MongoDB for the project and only grabs the ones with a price and sorts them in ascending order
  const collection = await Collection.find({
    listing_lovelace: { $nin: [-1, undefined] },
  })
    // .sort({  date : -1})
    // .limit( count )
    .sort({ listing_lovelace: 1 })
    .select({ listing_lovelace: 1, traits: 1, policy_id: 1 });

  console.log(collection);

  // Create a blank array to store the floor prices by trait
  let traitFloorTable = {};

  // Search each nft in a project with a price pulled from Mongo
  for (let individualNft of collection) {
    for (let i in individualNft.traits[0]) {
      if (Array.isArray(individualNft.traits[0][i])) {
        // console.log('this IS an array')

        individualNft.traits[0][i].forEach((trait) => {
          //console.log(trait)
          let separated = trait.split(":");
          let key = separated[0];
          let value = separated[1];

          let nftTrait = `${key},${value}`;

          if (!traitFloorTable.hasOwnProperty(nftTrait))
            traitFloorTable[nftTrait] = individualNft.listing_lovelace;
        });
      } else {
        //console.log(`${i}: ${individualNft.traits[0][i]}`)

        let nftTrait = `${i},${individualNft.traits[0][i]}`;

        if (!traitFloorTable.hasOwnProperty(nftTrait))
          traitFloorTable[nftTrait] = individualNft.listing_lovelace;
      }
    }
  }
  console.log(traitFloorTable);

  const NftFloor = mongoose.model(
    `${collectionModel}_Floors`,
    traitFloorSchema,
    `${collectionModel}_Floors`
  );

  // Create Object, nftFloor, using Class, NftFloor, to save the data to MongoDB
  const nftFloorData = new NftFloor({
    trait_floors: traitFloorTable,
    policy_id: collection[0].policy_id,
  });
  // console.log(traitFloorTable)

  // Save the model to the database
  const result = await nftFloorData.save();

  // mongoose.disconnect();
}

exports.insertFloorData = insertFloorData;

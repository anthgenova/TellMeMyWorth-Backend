const mongoose = require("mongoose");
// const { nftSchema } = require("../models/schemas/nftSchema");
const { Floor } = require("../models/floors");

async function insertFloorData(collectionModel, database = "test") {
//   const Collection = mongoose.model(
//     collectionModel,
//     nftSchema,
//     collectionModel
//   );

  //     mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
  // .then(() => console.log('Connecting to MongoDB...'))
  // .catch(err => console.error('Could not connect to MongoDB...', err));

//   mongoose.connect(`mongodb+srv://TellTwan:q23LUx8K0617E5pa@TellMeMyWorth-CoreDB-6341cc4d.mongo.ondigitalocean.com/TellMeMyWorth?authSource=admin&replicaSet=TellMeMyWorth-CoreDB&tls=true`)
//     .then(() => console.log('Connecting to MongoDB...'))
//     .catch(err => console.error('Could not connect to MongoDB...', err));


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

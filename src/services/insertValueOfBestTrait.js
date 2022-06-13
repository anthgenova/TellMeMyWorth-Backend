const mongoose = require("mongoose");
const { traitFloorSchema } = require("../models/schemas/traitFloorSchema");
const { nftSchema } = require("../models/schemas/nftSchema");

async function insertValueOfBestTrait(collectionModel, database = "test") {
  // await mongoose.connect(`mongodb://localhost/TellMeMyWorth_Floors`)
  // await mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
  //     .then(() => console.log('Connecting to MongoDB...'))
  //     .catch(err => console.error('Could not connect to MongoDB...', err));

  // Grabs the latest floor prices for all the traits
  const NftFloor = mongoose.model(
    `${collectionModel}_Floors`,
    traitFloorSchema,
    `${collectionModel}_Floors`
  );
  const traitFloors = await NftFloor.find()
    .sort({ date: -1 })
    .limit(1)
    .select({ trait_floors: 1 });
  console.log(traitFloors[0].trait_floors);

  // mongoose.disconnect();

  // Grabs all the nfts in the database for a collection
  // await mongoose.connect(`mongodb://localhost/TellMeMyWorth_Collections`)
  // await mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
  //     .then(() => console.log('Connecting to MongoDB...'))
  //     .catch(err => console.error('Could not connect to MongoDB...', err));

  const Nft = mongoose.model(
    `${collectionModel}`,
    nftSchema,
    `${collectionModel}`
  );
  const nfts = await Nft.find().select({ traits: 1, fingerprint: 1 });

  // Goes through each nft in the collection and compares its traits to the floor prices
  for (let individualNft of nfts) {
    let bestNftTrait;
    let bestNftTraitValue = 0;

    // Goes through each trait for an nft
    for (let i in individualNft.traits[0]) {
      // Restart the nftTrait variable to undefined for each iteration
      let nftTrait;

      // If the traits are trapped in an array, run through this block to split them up then combine
      if (Array.isArray(individualNft.traits[0][i])) {
        individualNft.traits[0][i].forEach((trait) => {
          let separated = trait.split(":");
          let key = separated[0];
          let value = separated[1];

          nftTrait = `${key},${value}`;
        });
      } else {
        nftTrait = `${i},${individualNft.traits[0][i]}`;
      }

      // Compares the current highest value of a trait with the previous ones and saves it if it is the highest
      if (traitFloors[0].trait_floors[0][nftTrait] > bestNftTraitValue) {
        bestNftTraitValue = traitFloors[0].trait_floors[0][nftTrait];
        bestNftTrait = nftTrait;
      }
      console.log(nftTrait);
    }

    // Set the value of Best Trait to the nft in the database
    const bestValue = await Nft.updateOne(
      { fingerprint: individualNft.fingerprint },
      {
        $set: {
          valueOfBestTrait: bestNftTraitValue,
          bestTrait: bestNftTrait,
        },
      }
    );
    //console.log(updatedPrice)
  }

  // mongoose.disconnect();
}

exports.insertValueOfBestTrait = insertValueOfBestTrait;

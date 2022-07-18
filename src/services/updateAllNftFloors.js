const { forEach } = require("lodash");
const mongoose = require("mongoose");
const { Floor } = require("../models/floors");
const { nftSchema } = require("../models/schemas/nftSchemaNew");

let globalMetadataArray = []

async function denestObject(nft, i = 1, metadataArray = []){
  // console.log(nft)
  // let metadataArray = []
  let thisMetadata = ''
  // console.log(nft)
  // console.log(nft.onchain_metadata)
  // console.log(Object.entries(nft.onchain_metadata))
  try{
  Object.entries(nft).forEach(async metadata =>{
    if (Array.isArray(metadata[1])) {
      // console.log('this IS an array')
      metadata[1].forEach(async (trait) => {
        // if (typeof metadata[1] === 'object'){
        //   await denestObject(metadata[1], i++)
  
        // } else {
        // console.log(typeof metadata[1] + metadata[1].toString())
        thisMetadata = trait.toString().replace(':', ',')
        // }
        // console.log(trait)
        metadataArray.push(thisMetadata)

      });
    
    } else if (typeof metadata[1] === 'object'){
      // let nestObject = metadata[1]
      // console.log(await denestObject(metadata[1]))
      // console.log((metadata[1]))
      // console.log(await denestObject(metadata[1]))
      // try{
      // let objectToString = await denestObject(metadata[1], i++)
      thisMetadata = metadata[0] + ' / ' + await denestObject(metadata[1], i++)

      // console.log(thisMetadata)
      // } catch {

      // }
      metadataArray.push(thisMetadata)
    } else {
      thisMetadata = metadata[0] + ', ' + metadata[1]
      metadataArray.push(thisMetadata)
    } 
    // if ( i===1){
    // globalMetadataArray.push(thisMetadata)
    // // console.log (thisMetadata)
    // }

  })
} catch {}

  // if ( i===1){
  //   globalMetadataArray.push(thisMetadata)
  //   // console.log (globalMetadataArray)
  //   }

  // if(i>2) console.log(i + thisMetadata)
// console.log(metadataArray)
// } catch { }
// console.log (globalMetadataArray)
return metadataArray
// Object.entries(nestedObject).forEach(metadataObject =>{
  //   if (Array.isArray(metadataObject[1])) {
  //     // console.log('this IS an array')

  //     metadataObject[1].forEach((trait) => {
  //       let formatedTrait = trait.toString().replace(':', ',')
  //       console.log(formatedTrait)
  //       metadataArray.push(formatedTrait)

  //     });
    
  //   } else {
  //     thisMetadataObject = metadataObject[0] + ', ' + metadataObject[1]
  //     metadataArray.push(thisMetadataObject)
  //   } 
  // })
}

async function denestArray(nestedArray){

}

async function updateAllNftFloors() {
    //   mongoose.connect(`mongodb://localhost/TellMeMyWorth_Collections`)
    //   mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
    //       .then(() => console.log('Connecting to MongoDB...'))
    //       .catch(err => console.error('Could not connect to MongoDB...', err));
    
        // let floorNames = await blockfrost.getNftNames(policyId)
        // console.log(floorNames)
    
        const floors = await Floor
          .find()
          // .find({policy_id: "4bf184e01e0f163296ab253edd60774e2d34367d0e7b6cbc689b567d"})
          .select({ trait_floors: 1, policy_id:1 })
            // .limit(1);
    
            // console.log(floors)
    
            // floors.forEach(async (floor, index) => {
                for( const floor of floors){
              // console.log(floor.trait_floors[0])

                // await timeout(100 * (index + 1))
                // console.log(floor[index].policy + '.' + floor[index].name)
                const Nft = mongoose.model(floor.policy_id, nftSchema, floor.policy_id);

                // console.log(floor.trait_floors)

                const nfts = await Nft
                .find()
                .select({ onchain_metadata: 1, fingerprint: 1 })


                nfts.forEach(async (nft) => {
                  globalMetadataArray = []
                  // console.log(await denestObject(nft.onchain_metadata))
                  metadataArray = await denestObject(nft.onchain_metadata)
                  // console.log(await denestObject(nft.onchain_metadata))
                  console.log('__________________')
                  // console.log(metadataArray)

                  let traitValues = {}
                  metadataArray.forEach(assetMetada =>{
                    // console.log('AAAAAAAAAAAAAAAAAAA')
                    // console.log(floor.trait_floors[0])
                    if(floor.trait_floors[0][assetMetada] !== undefined){
                      traitValues[assetMetada] = floor.trait_floors[0][assetMetada]
                    } else if (floor.trait_floors[0][assetMetada.toLowerCase()] !== undefined){
                      traitValues[assetMetada] = floor.trait_floors[0][assetMetada.toLowerCase()]
                    }
                  })
                  // console.log(traitValues)
                  let bestTraitAndValue = Object.entries(traitValues).sort((x, y) => y[1] - x[1])[0]

                  if(bestTraitAndValue){
                    console.log(bestTraitAndValue[1])
                    console.log(bestTraitAndValue[0])
                    console.log(nft.fingerprint)
                    console.log(Nft)
                  
                  await Nft.updateOne(
                    { fingerprint: nft.fingerprint },
                    {
                      $set: {
                        valueOfBestTrait: bestTraitAndValue[1],
                        bestTrait: bestTraitAndValue[0],
                        date: Date.now(),
                      },
                    }
                  )
                  }
                  console.log(bestTraitAndValue)
                  
                  // console.log(Object.keys(globalMetadataArray).reduce((a, b) => obj[a] > obj[b] ? a : b))
                  /*
                  let metadataArray = []
                  let thisMetadata = ''
                  // console.log(nft.onchain_metadata)
                  // console.log(Object.entries(nft.onchain_metadata))
                  Object.entries(nft.onchain_metadata).forEach(metadata =>{
                    // if (Array.isArray(metadata[1])){
                      if (Array.isArray(metadata[1])) {
                        // console.log('this IS an array')
                
                        metadata[1].forEach((trait) => {
                          let formatedTrait = trait.toString().replace(':', ',')
                          console.log(formatedTrait)
                          metadataArray.push(formatedTrait)

                        });
                
                      // thisMetadata = metadata[0] + ', ' + metadata[1]
                      // metadataArray.push(thisMetadata)
                      // console.log(metadata[0])
                      // console.log(metadata[1])

                    // } else if (typeof metadata[1] === 'object'){ 
                    //   Object.entries(metadata[1]).forEach(metadataObject =>{
                    //     if (Array.isArray(metadataObject[1])) {
                    //       // console.log('this IS an array')
                  
                    //       metadataObject[1].forEach((trait) => {
                    //         let formatedTrait = trait.toString().replace(':', ',')
                    //         console.log(formatedTrait)
                    //         metadataArray.push(formatedTrait)
  
                    //       });
                        
                    //     } else {
                    //       thisMetadataObject = metadataObject[0] + ', ' + metadataObject[1]
                    //       metadataArray.push(thisMetadataObject)
                    //     } 
                    //   })

                    } else {
                      thisMetadata = metadata[0] + ', ' + metadata[1]
                      metadataArray.push(thisMetadata)
                    } 

                  })
                  console.log(metadataArray)
                  */
                })
              //   console.log(Nft)
              //   await Nft.updateMany({}, {
              //     $set: {
              //     //   policy_id: token.policy_id,
              //     //   asset_name: token.asset_name,
              //       valueOfToken: token.valueOfToken,
              //     //   traitsAreUnique: token.traitsAreUnique,
              //       date: Date.now(),
              //     }  
              // })
    
                // if(floor.minted_quantity === 1 ){
                //   await timeout(100 * (index + 1))
    
                //   const fingerprintFound = await Nft.find({
                //     fingerprint: floor.fingerprint ,
                //   })
                //     .select({ fingerprint: 1 })
                //     .limit(1);
                  
                //   if(fingerprintFound.length === 0){
    
                //   // const cid = new CID(floor.name).toV1().toString('hex')
                //   const encoded = new Buffer.from(floor.name).toString('hex');
                //   let floorData = await blockfrost.getfloorMetadata(floor.policy + encoded)
                //   console.log('ran')
                //   console.log(floorData)
                //   const nftData = new Nft({
                //     floor: floorData.floor,
                //     policy_id: floorData.policy_id,
                //     floor_name: floorData.floor_name,
                //     fingerprint: floorData.fingerprint,
                //     quantity: floorData.quantity,
                //     onchain_metadata: floorData.onchain_metadata,
                //   });
    
                //   nftData.save()
                // }
              // }
            }
            // })
}
// updateAllNftFloors()
exports.updateAllNftFloors = updateAllNftFloors;
    
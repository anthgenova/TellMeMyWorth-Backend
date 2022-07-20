const { forEach } = require("lodash");
const mongoose = require("mongoose");
const { Floor } = require("../models/floors");
const { nftSchema } = require("../models/schemas/nftSchemaNew");

let globalMetadataArray = []

async function denestObject(nft, i = 1, metadataArray = [], keyPassed = ''){
  // console.log(nft)
  // console.log(keyPassed)
  // let metadataArray = []
  let thisMetadata = ''
  // console.log(nft)
  // console.log(nft.onchain_metadata)
  // console.log(Object.entries(nft.onchain_metadata))
  // try{
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
        globalMetadataArray.push(thisMetadata)

      });
    
    } else if (typeof metadata[1] === 'object'){
      // let nestObject = metadata[1]
      // console.log(await denestObject(metadata[1]))
      // console.log((metadata[1]))
      // console.log(await denestObject(metadata[1]))
      // try{
      // let objectToString = await denestObject(metadata[1], i++)
      thisMetadata = metadata[0] + ' / ' + await denestObject(metadata[1], i++, [], metadata[0])

      // console.log(thisMetadata)
      // } catch {

      // }
      metadataArray.push(thisMetadata)
    } else {
      if(keyPassed){
        thisMetadata = keyPassed + ' / ' + metadata[0] + ', ' + metadata[1]
      } else {
        thisMetadata = metadata[0] + ', ' + metadata[1]
      }
      globalMetadataArray.push(thisMetadata)
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
//   console.log(metadataArray)
return globalMetadataArray
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

async function updateMyNftFloors(policyId, fingerprint) {
    //   mongoose.connect(`mongodb://localhost/TellMeMyWorth_Collections`)
      // mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
      //     .then(() => console.log('Connecting to MongoDB...'))
      //     .catch(err => console.error('Could not connect to MongoDB...', err));
    
        // let floorNames = await blockfrost.getNftNames(policyId)
        // console.log(floorNames)
        // console.log(policyId)
        // console.log(fingerprint)
    
        const floors = await Floor
          .find({policy_id: {$eq: policyId}})
          // .find({policy_id: "4bf184e01e0f163296ab253edd60774e2d34367d0e7b6cbc689b567d"})
          .select({ trait_floors: 1, policy_id:1 })
            // .limit(1);
    
            // console.log(floors)
    
            // floors.forEach(async (floor, index) => {
            for(const floor of floors){
              // console.log(floor.trait_floors[0])

                // await timeout(100 * (index + 1))
                // console.log(floor[index].policy + '.' + floor[index].name)
                const Nft = mongoose.model(floor.policy_id, nftSchema, floor.policy_id);

                // console.log(Nft)

                const nfts = await Nft
                .find({fingerprint: fingerprint})
                .select({ onchain_metadata: 1, fingerprint: 1 })
                // console.log(nfts)

                nfts.forEach(async (nft) => {
                  globalMetadataArray = []
                  // console.log(nft.onchain_metadata)
                  metadataArray = await denestObject(nft.onchain_metadata)
                  // console.log(await denestObject(nft.onchain_metadata))
                  console.log(metadataArray)
                  // console.log(floor.trait_floors[0])
                  // console.log(floor.trait_floors[0]['attributes / Headwear, red horns'])

                  let traitValues = {}
                  metadataArray.forEach(assetMetada =>{
                    // console.log('AAAAAAAAAAAAAAAAAAA')
                    // console.log('attributes / Background, pink')
                    // console.log('attributes / Background, Pink')
                    // console.log(floor.trait_floors[0])
                    // console.log(assetMetada )
                    // console.log(assetMetada.toLowerCase() )
                    // console.log(floor.trait_floors[0][Object.keys(floor.trait_floors[0]).find(key => key.toLowerCase() === assetMetada.toLowerCase())])
                    if(floor.trait_floors[0][assetMetada] !== undefined){
                      // console.log('1')
                      traitValues[assetMetada] = floor.trait_floors[0][assetMetada]

                    } else if (floor.trait_floors[0][Object.keys(floor.trait_floors[0]).find(key => key.toLowerCase() === assetMetada.toLowerCase())] !== undefined){
                      // console.log('2')
                      traitValues[assetMetada] = floor.trait_floors[0][Object.keys(floor.trait_floors[0]).find(key => key.toLowerCase() === assetMetada.toLowerCase())]
                    } 
                  })
                  let bestTraitAndValue = Object.entries(traitValues).sort((x, y) => y[1] - x[1])[0]
console.log(bestTraitAndValue)
                  if(bestTraitAndValue){
                    // console.log(bestTraitAndValue[1])
                    // console.log(bestTraitAndValue[0])
                    // console.log(nft.fingerprint)
                    // console.log(Nft)
                  
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
                  // console.log(bestTraitAndValue)
                  
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
        // })
              }
    }
// updateMyNftFloors()
// updateMyNftFloors('40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728', 'asset1r4e9fx6mpw029ss0h9smnuzfuzf5snf4mc0lr2')
exports.updateMyNftFloors = updateMyNftFloors;
    
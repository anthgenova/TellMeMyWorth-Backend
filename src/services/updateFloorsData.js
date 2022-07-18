const mongoose = require("mongoose");
const superagent = require('superagent');
// const { getAllPoliciesData } = require("../apiServices/cnftjungleApi");
const { PolicyId } = require("../models/policiesTest");
const { Floor } = require("../models/floors");

function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateFloorsData (){
//           mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
//   .then(() => console.log('Connecting to MongoDB...'))
//   .catch(err => console.error('Could not connect to MongoDB...', err));

    const policiesFound = await Floor
        .find()
        .select({ policy_id: 1 })

    // let index = 1
    // for (const policyFound of policiesFound){
    policiesFound.forEach(async (policyFound, index) => {

        await timeout(200 * (index + 1))
        // index++
        const id = await PolicyId
            .find({policies: policyFound.policy_id})
            .select({ id: 1 })
            .limit(1);
  
        try {
            const res = await superagent.get(`https://api.cnftjungle.app/utils/traitfloors/${id[0].id}`);
            // console.log(res.body.floors);
            const data = await res.body.floors;
            console.log(data)
      
            // let traitTypes = Object.keys(data)
            // let traitValues = Object.keys(Object.values(data))
            let traitFloorTable = {}
            console.log('restart')
            let i =0
            let saveData = {};
            for(let [key, value] of Object.entries(data)) {
                i++
                saveData ={}
                console.log(i)
                // console.log(`${key}: ${value}`);
                for(let [insideKey, insideValue] of Object.entries(value)) {
                    let traitArray = [];
                    let nestedObject = {};
                    //console.log(`${insideKey}: ${insideValue}`)
                    if(insideKey.includes('[' && ']')){
                        // console.log(typeof insideKey)
                        
                        let inside = insideKey.replace("['", '').replace("']", '').replaceAll("'", "")
      
                        traitArray = inside.split(", ");
                        // console.log(traitArray)
      
                        traitArray.forEach(trait => {
                            nestedObject = {}
                            splitTraits = trait.split(': ')
                            // console.log(splitTraits[0])
                            joinedTraits = splitTraits[0] + ', ' + splitTraits[1]
      
                            if (!traitFloorTable.hasOwnProperty(joinedTraits) || traitFloorTable[joinedTraits] > insideValue){
                                traitFloorTable[joinedTraits] = insideValue;
                                // traitFloorTable[joinedTraits] = insideValue;
                            }
                            
                        })
                        // console.log(traitFloorTable)
      
                        saveData = traitFloorTable
      
                    } else {
                        // console.log(`${typeof key}: ${ insideKey}: ${typeof insideValue}`)
                        traitFloorTable[`${key}, ${insideKey}`] = insideValue;
                        // saveData = data;
                    }
                }
            }
      
            let sortable = [];
            for (let trait in traitFloorTable) {
                sortable.push([trait, traitFloorTable[trait]]);
            }
      
            sortable.sort(function(a, b) {
                return a[1] - b[1];
            });
      
            // console.log(sortable)
      
            let sortedTraitFloorTable = {}
            for(let i = 0; i < sortable.length; i++){
                // sortedTraitArray = sortable[i][0].split(", ");
                sortedTraitFloorTable[sortable[i][0]] = sortable[i][1]
                // console.log(sortedTraitFloorTable)
                // console.log(sortable[i][0])
            }
      
      
            console.log(sortedTraitFloorTable)
            const nftFloorData = new Floor({
                trait_floors: sortedTraitFloorTable,
                policy_id: policyFound.policy_id,
                });
                // console.log(nftFloorData)
  
            // const floorFound = await Floor.find({
            //   policy_id: policyFound.policy_id ,
            // })
            //   .select({ policy_id: 1 })
            //   .limit(1);
            
            // if (floorFound.length > 0) {
                const floorUpdate = await Floor.updateOne(
                { policy_id: policyFound.policy_id },
                {
                  $set: {
                    trait_floors: sortedTraitFloorTable,
                    date: Date.now(),
                  },
                }
              );
          
            // } else {   
            //   const result = await nftFloorData.save();
            // }
        } catch (err) {
            console.error(policyFound.policy_id + err);
            // if (retries > 0) {
            //   const turnsLeft = retries - 1;
            //   return getFloors(idSearch, turnsLeft);
            // }
        }
  

    })
}

// updateFloorsData()
exports.updateFloorsData = updateFloorsData;

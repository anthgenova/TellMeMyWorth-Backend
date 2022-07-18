const mongoose = require("mongoose");
const superagent = require('superagent');
const { getAllPoliciesData } = require("../apiServices/cnftjungleApi");
const { PolicyId } = require("../models/policiesTest");
const { Floor } = require("../models/floors");

// const { tokenSchema } = require("../models/schemas/tokenSchema");
function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function insertPolicyData() {
  //     mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
  // .then(() => console.log('Connecting to MongoDB...'))
  // .catch(err => console.error('Could not connect to MongoDB...', err));

  // mongoose.connect(`mongodb+srv://TellTwan:q23LUx8K0617E5pa@TellMeMyWorth-CoreDB-6341cc4d.mongo.ondigitalocean.com/TellMeMyWorth?authSource=admin&replicaSet=TellMeMyWorth-CoreDB&tls=true`)
  //   .then(() => console.log('Connecting to MongoDB...'))
  //   .catch(err => console.error('Could not connect to MongoDB...', err));

  const allPoliciesData = await getAllPoliciesData();
  console.log(typeof allPoliciesData)
  let policies = []
  
  allPoliciesData.forEach(async (policy, index) => {
    await timeout(300 * (index + 1))

    //  if(policy.listings > 1){
      const ID = new PolicyId(policy);
      // console.log( ID)
        // await ID.save()

        const policiesFound = await PolicyId.find({
          policies: policy.policies ,
        })
          .select({ policies: 1 })
          .limit(1);
        
        if (policiesFound.length > 0) {
            await PolicyId.updateOne(
            { policies: policy.policies },
            {
              $set: {
                supply: policy.supply,
                floor: policy.floor,
                listings: policy.listings,
                sales: policy.sales,
                date: Date.now(),
              },
            }
          );
      
        } else {   
          await ID.save()
        }

    //  }
    // console.log(ID.listings)
    if(ID.listings > 1){
      // console.log(ID.id)

      policies.push(ID.id)
      // console.log(policies)
      let idSearch=ID.id
      // console.log(idSearch)
      getFloors(ID.id)
      async function getFloors(idSearch, retries = 6) {
      try {
          const res = await superagent.get(`https://api.cnftjungle.app/utils/traitfloors/${idSearch}`);
          // console.log(res.body.floors);
          const data = await res.body.floors;
    
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
    
    
          const nftFloorData = new Floor({
              trait_floors: sortedTraitFloorTable,
              policy_id: policy.policies,
              });
              // console.log(nftFloorData)

          const floorFound = await Floor.find({
            policy_id: policy.policies ,
          })
            .select({ policy_id: 1 })
            .limit(1);
          
          if (floorFound.length > 0) {
              const floorUpdate = await Floor.updateOne(
              { policy_id: policy.policies },
              {
                $set: {
                  trait_floors: sortedTraitFloorTable,
                  date: Date.now(),
                },
              }
            );
        
          } else {   
            const result = await nftFloorData.save();
          }
      } catch (err) {
          console.error(policy.id + err);
          // if (retries > 0) {
          //   const turnsLeft = retries - 1;
          //   return getFloors(idSearch, turnsLeft);
          // }
      }
    }
    }
  })
  
  
  // for(let k = 0; k < policies.length; k++){
  //   console.log(policies)
  // }


    // mongoose.disconnect();
//   return collectionName;
}

// insertTokenData('a0028f350aaabe0545fdcb56b039bfb08e4bb4d8c4d7c3c7d481c235', 'HOSKY')
// insertPolicyData();
exports.insertPolicyData = insertPolicyData;

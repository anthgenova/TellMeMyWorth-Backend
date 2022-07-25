const mongoose = require("mongoose");
const superagent = require('superagent');
const throttledQueue = require('throttled-queue');
const Throttle    = require('superagent-throttle')
const { PolicyId } = require("../models/policiesTest");
const { Floor } = require("../models/floors");



// async function getTokenPrices(policyId, ticker) {
async function getAllPoliciesData() {
    let page = 1;
    let allPoliciesData = [];
    let lastResult =[];

    do{
        try {
            console.log('page' + page)

            const res = await superagent.get(`https://api.cnftjungle.app/collections?sort=popularity&sortDirection=desc&perPage=1000&page=${page}`);
            console.log(res.body.collections)
            const data = await res.body.collections;
            lastResult = data;
            // console.log(Object.keys(lastResult).length)
            console.log(lastResult)
            data.forEach(policy => {
                const { collection_name, policies, supply, floor, id, listings, sales } = policy;
                allPoliciesData.push({ collection_name, policies, supply, floor, id, listings, sales });
            });
            page++
            console.log(lastResult.length)
            if (lastResult.length < 1000){
                console.log('break')
                break
            }

            //   console.log(res.body);
            //   console.log(typeof res.body.tokens)
            // return tokens = res.body
        } catch (err) {
            console.error(err);
        }
    } while (lastResult != null)
    // } while (page < 6)

    console.log (allPoliciesData);
    return(allPoliciesData);
};

async function getClayPitchesData() {
    let page = 1;
    let allPoliciesData = [];
    let lastResult =[];

    // do{
        try {
            // console.log('page' + page)

            const res = await superagent.get(`https://api.cnftjungle.app/collections/50890?page=1&perPage=40000&sort=assetNumber&sortDirection=asc&traitFilterLogic=union&priceType=ada&rarityType=score&rewardType=staking`);
            // console.log(res.body.assets)
            const data = await res.body.assets;
            lastResult = data;
            // console.log(Object.keys(lastResult).length)
            // console.log(lastResult)
            data.forEach(policy => {
                const { traits, name, listing_price } = policy;
                allPoliciesData.push({ traits, name, listing_price });
            });
            // page++
            // console.log(lastResult.length)
            // if (lastResult.length < 1000){
            //     console.log('break')
            //     break
            // }

            //   console.log(res.body);
            //   console.log(typeof res.body.tokens)
            // return tokens = res.body
        } catch (err) {
            console.error(err);
        }
    // } while (lastResult != null)
    // } while (page < 6)

    // console.log (allPoliciesData);
    return(allPoliciesData);

}

// function getNested(obj, ...args) {
//     return args.reduce((obj, level) => obj && obj[level], obj)
// }
// function checkNested(obj, level,  ...rest) {
//     if (obj === undefined) return false
//     if (rest.length == 0 && obj.hasOwnProperty(level)) return true
//     return checkNested(obj[level], ...rest)
//   }

/*
async function getAllFloorData(){
    mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
    .then(() => console.log('Connecting to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

    //   mongoose.connect(`mongodb+srv://TellTwan:q23LUx8K0617E5pa@TellMeMyWorth-CoreDB-6341cc4d.mongo.ondigitalocean.com/TellMeMyWorth?authSource=admin&replicaSet=TellMeMyWorth-CoreDB&tls=true`)
    // .then(() => console.log('Connecting to MongoDB...'))
    // .catch(err => console.error('Could not connect to MongoDB...', err));


    const policies = await PolicyId //.find({
    //     listing_lovelace: { $nin: [-1, undefined] },
    //   })
    .find({listings: {$gt: 1}})
    // .find({id: 36939})
    // .find({id: 41010})
        // .sort({  date : -1})
        // .limit( count )
        // .sort({ floor: -1 })
        .select({ id: 1, policies: 1, floor: 1 });

        let allFloorData = [];
        const throttle = throttledQueue(5, 1000);

        
        policies.forEach(async (policy) => {
            try {
                const res = await superagent.get(`https://api.cnftjungle.app/utils/traitfloors/${parseInt(policy.id)}`);
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
                                // console.log(!checkNested(traitFloorTable, splitTraits[0], splitTraits[1]))
                                // console.log('__________________')
                                // console.log(traitFloorTable)
                                // let nested = getNested(traitFloorTable, splitTraits[0])
                                // if(nested)
                                // console.log(Object.keys(nested))
                                // console.log(getNested(traitFloorTable, splitTraits[0], splitTraits[1]))
                                // if (!checkNested(traitFloorTable, splitTraits[0], splitTraits[1]) || getNested(traitFloorTable, splitTraits[0], splitTraits[1]) > insideValue) {
                                //     nestedObject[splitTraits[1]] = insideValue
                                //     traitFloorTable[splitTraits[0]] = nestedObject;
                                //     console.log('HERE')
                                // }
                                // // traitFloorTable[splitTraits[0]] = splitTraits[0][insideValue];
                                // console.log(nestedObject)
                                // console.log(splitTraits[0] + splitTraits[1])

                                // console.log('[[[[[[[[[[[[[[[[[[' + splitTraits[0])
                                // console.log(']]]]]]]]]]]' + splitTraits[1])
                                // console.log(splitTraits[0] + ': ' + splitTraits[1] + ': ' + insideValue)
                                
                            })
                            // console.log(traitFloorTable)

                            saveData = traitFloorTable

                            // console.log(traitFloorTable)
                            // console.log(inside)
                            // console.log(traitArray)
                            // console.log(insideValue)


                            // let separated = trait.split(":");
                            // let key = separated[0];
                            // let value = separated[1];
                  
                            // let nftTrait = `${key},${value}`;
                  
                            // if (!traitFloorTable.hasOwnProperty(nftTrait))
                            //   traitFloorTable[nftTrait] = individualNft.listing_lovelace;
                  
                        } else {
                            // console.log(`${typeof key}: ${ insideKey}: ${typeof insideValue}`)
                            traitFloorTable[`${key}, ${insideKey}`] = insideValue;
                            // saveData = data;
                        }
                        // for(const [insideK, insideV] of Object.entries(value)) {
                            //     console.log(`${key}: ${insideKey}: ${insideK}`)
                            // }
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
                const result = await nftFloorData.save();

                // for(let i = 0; i < Object.keys(data).length; i++){
                //     console.log('###########' + Object.keys(data[i]))
                // }
                // console.log('============' + Object.keys(data))
                // console.log('============' + traitValues)
                // data.forEach

                // data[0].forEach(trait => {
                //     console.log('============' + trait)
                // })
                // for (let individualTrait of res.body.floors) {
                //     console.log('@@@@@@@@@@' + individualTrait)

                //     for (let i in individualTrait.traits[0]) {
                //         console.log('============' + i)
                //         // let nftTrait = `${i},${individualTrait.traits[0][i]}`;
                //     }

                // }

                // console.log(parseInt(policy.id))
                // console.log(policy.id)
            } catch (err) {
                console.error(policy.id + err);
            }
        })
            console.log(policies)
    // const res = await superagent.get(`https://api.cnftjungle.app/utils/traitfloors${id}`);
    // console.log(res.body.collections)


    // do{
    //     try {
    //         console.log('page' + page)

    //         const res = await superagent.get(`https://api.cnftjungle.app/utils/traitfloors${id}`);
    //         console.log(res.body.collections)
    //         const data = await res.body.collections;
    //         lastResult = data;
    //         // console.log(Object.keys(lastResult).length)
    //         console.log(lastResult)
    //         data.forEach(policy => {
    //             const { collection_name, policies, supply, floor, id } = policy;
    //             allFloorData.push({ collection_name, policies, supply, floor, id });
    //         });
    //         page++
    //         console.log(lastResult.length)
    //         if (lastResult.length < 1000){
    //             console.log('break')
    //             break
    //         }

    //         //   console.log(res.body);
    //         //   console.log(typeof res.body.tokens)
    //         // return tokens = res.body
    //     } catch (err) {
    //         console.error(err);
    //     }
    // } while (lastResult != null)

    // console.log (allFloorData);
    // return(allFloorData);

}
// getAllPoliciesData()
// async function getTokenPrice(policyId, ticker) {
//     try {
//   const res = await superagent.get(`http://analyticsv2.muesliswap.com/ticker`);
//   console.log(res.body[`${policyId}.${ticker}_ADA`].last_price);
// //   console.log(typeof res.body.tokens)
//   return tokenPrice = res.body[`${policyId}.${ticker}_ADA`].last_price
// } catch (err) {
//   console.error(err);
// }
// };
getAllFloorData()
*/

// getClayPitchesData()
// getTokenPrice('ff97c85de383ebf0b047667ef23c697967719def58d380caf7f04b64', 'SOUL')
module.exports.getAllPoliciesData = getAllPoliciesData
module.exports.getClayPitchesData = getClayPitchesData
// module.exports.getTokenPrice = getTokenPrice

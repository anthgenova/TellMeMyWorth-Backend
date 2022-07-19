const mongoose = require("mongoose");
const muesliswapApi = require("../apiServices/muesliswapApi.js");
const { Token } = require("../models/tokens");


async function updateTokenData() {
    //         mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
    // .then(() => console.log('Connecting to MongoDB...'))
    // .catch(err => console.error('Could not connect to MongoDB...', err));

    const tokens = await muesliswapApi.getTokenPrices();

    let tokenPoliciesList = []
    Object.keys(tokens).forEach(tokenPolicy => {
        const splitPolicyTicker = tokenPolicy.split('.')
        tokenPoliciesList.push(splitPolicyTicker[0])
    })
    // console.log(tokenPoliciesList)

    const savedTokens = await Token
        .find({ policy_id: {$in: tokenPoliciesList}})
        .select({policy_id: 1, asset_name: 1})

    // console.log(savedTokens)

    let savedTokensList = []
    // let savedTokensList = {}
    savedTokens.forEach(savedToken => {
        // savedTokensList.push([savedToken.policy_id, savedToken.asset_name])
        savedTokensList.push(`${savedToken.policy_id}.${savedToken.asset_name}_ADA`)
    })
    // console.log(savedTokensList)
    
    for(const token of Object.keys(tokens)){
        const splitPolicyTicker = token.split('.')
        // const policyId = splitPolicyTicker[0]
        // const ticker = splitPolicyTicker[1].replace('_ADA', '')
        const policyId = token.slice(0, token.indexOf('.'))
        const ticker = token.slice(token.indexOf('.') + 1).replace('_ADA', '')

        if(tokens[token].last_price !== 'NA'){
            // console.log( policyId)
            console.log( token)
            // console.log( token.substring())
            // console.log( savedTokens)
            // console.log( tokens[token])
            if(savedTokensList.indexOf(token) >= 0 ){
                // if(savedTokensList.indexOf(policyId) >= 0 ){
                    // console.log('[[[[[[[[[[[[')
                    // console.log(policyId)
                    // console.log(ticker)
                    await Token.updateOne(
                    { policy_id: policyId, asset_name: ticker },
                    {
                    $set: {
                        // policy_id: policyId,
                        asset_name: ticker,
                        valueOfToken: tokens[token].last_price,
                        date:  Date.now() ,
                        },
                    }
                )
            } else {
                const newToken = new Token({
                        policy_id: policyId,
                        asset_name: ticker,
                        valueOfToken: tokens[token].last_price,
                        date:  Date.now() ,

                })
                newToken.save()
                // console.log('NOPE')
            }

        }
    }
    // tokens.forEach((token) => {
        // console.log( Object.keys(tokens))

    // })
    // return tokenPrices;
  }
  
//   getTokenPrices()  
  exports.updateTokenData = updateTokenData;
  
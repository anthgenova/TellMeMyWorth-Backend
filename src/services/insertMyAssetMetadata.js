const mongoose = require("mongoose");
const CID = require('cids')
const { getNftData } = require("../services/getNftData");
const blockfrost = require("../apiServices/blockfrostApi");
// const { getCollectionName } = require("../services/getCollectionName");
// const { PolicyId } = require("../models/policiesTest");
const { Wallet } = require("../models/wallet");
// const { Nft } = require("../models/nfts");
const { nftSchema } = require("../models/schemas/nftSchemaNew");



function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function insertMyAssetMetadata(addr, token, iterationIndex) {
//   mongoose.connect(`mongodb://localhost/TellMeMyWorth_Collections`)
  // mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
  //     .then(() => console.log('Connecting to MongoDB...'))
  //     .catch(err => console.error('Could not connect to MongoDB...', err));


    // let assetNames = await blockfrost.getNftNames(policyId)
    // console.log(assetNames)

    const assets = await Wallet.find({
        addr: addr ,
      })
        .select({ tokens: 1 })
        .limit(1);
        // console.log(assets[0].tokens)

    // try{
    // assets[0].tokens.forEach(async (asset, index) => {
      // console.log(iterationIndex)

            // await timeout(200 * (index + 1))
            // console.log(token[index].policy + '.' + token[index].name)
            const Nft = mongoose.model(token.policy, nftSchema, token.policy);

            if(token.minted_quantity === 1 ){
              // await timeout(200 * (index + 1))

              const fingerprintFound = await Nft.find({
                fingerprint: token.fingerprint ,
              })
                .select({ fingerprint: 1 })
                .limit(1);
              
              if(fingerprintFound.length === 0){

              // const cid = new CID(token.name).toV1().toString('hex')
              const encoded = new Buffer.from(token.name).toString('hex');
              // try{
              let assetData = await blockfrost.getAssetMetadata(token.policy + encoded, iterationIndex)
              // console.log('ran')
              // console.log(assetData)
              // console.log('FFFFFFFFFFFFFFFFFFFFFFFF')
              // console.log(token.policy + encoded)
              // console.log(assetData.token)
              // console.log(token.policy)

              const nftData = new Nft({
                asset: assetData.asset,
                policy_id: assetData.policy_id,
                asset_name: assetData.asset_name,
                fingerprint: assetData.fingerprint,
                quantity: assetData.quantity,
                onchain_metadata: assetData.onchain_metadata,
              });

              nftData.save()
            // } catch {}
            }
          }
    // })
  // } catch (err) {
  //   console.log(err)
  // }
}
// insertMyAssetMetadata('stake1u87t5uuaeevvjf23eztlat5m4lezmvphhy3rheu8askktzclt9l38')
exports.insertMyAssetMetadata = insertMyAssetMetadata;

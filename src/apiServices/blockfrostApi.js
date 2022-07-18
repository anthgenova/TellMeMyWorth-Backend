const superagent = require('superagent');

async function getNftNames(policyId) {
    let page = 1;
    let allPoliciesData = [];
    let lastResult =[];

    do{

        try {
            const res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/policy/${policyId}?page=${page}`).set('project_id', 'mainnetLBmnxxr04qZ3PKvOq9MhVRrs26YwrvTB');
            
            //console.log(res.body)
            const data = await res.body;
            lastResult = data;
            // console.log(Object.keys(lastResult).length)
            //console.log(lastResult)
            data.forEach(policy => {
                const { asset, quantity } = policy;
                allPoliciesData.push({ asset, quantity });
            });
            page++
            //console.log(lastResult.length)
            if (lastResult.length < 100){
                console.log('break')
                break
            }
        } catch (err) {
            console.error(err);
        }
        } while (lastResult != null)
        // } while (page < 2)
    console.log (allPoliciesData);
    return(allPoliciesData);
};

//getNftNames("94da605878403d07c144fe96cd50fe20c16186dd8d171c78ed6a8768")


async function getAssetMetadata(asset, iterationIndex) {
    try {
        // console.log(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`)
        let res 
        // if (iterationIndex === 1){
        //     res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`).set('project_id', 'mainnetLBmnxxr04qZ3PKvOq9MhVRrs26YwrvTB')
        //     console.log('mainnetLBmnxxr04qZ3PKvOq9MhVRrs26YwrvTB')
        // } else if (iterationIndex === 2){
        //      res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`).set('project_id', 'mainnetE4LHx84sWlx2z42F2UCSBxtxUANJpHxG')
        //     console.log('mainnetLBmnxxr04qZ3PKvOq9MhVRrs26YwrvTB')
        // } else if (iterationIndex === 3){
        //      res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`).set('project_id', 'mainnetleZKAVNP9lIl1POXsIWIRYxxmZzIYOzx')
        //     console.log('mainnetLBmnxxr04qZ3PKvOq9MhVRrs26YwrvTB')
        // }
        try {
            res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`).set('project_id', 'mainnetLBmnxxr04qZ3PKvOq9MhVRrs26YwrvTB')
        } catch {
            try{
                res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`).set('project_id', 'mainnetE4LHx84sWlx2z42F2UCSBxtxUANJpHxG')
            } catch {
                try {
                    res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`).set('project_id', 'mainnetleZKAVNP9lIl1POXsIWIRYxxmZzIYOzx')
                } catch {
                    try {
                        res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`).set('project_id', 'mainnetfujOtIBKntd9t4gQxNOBk0j9SEdhMcv2')
                    } catch {
                        try {
                            res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`).set('project_id', 'mainnetMb2rPO6CWD3KIsdPx1BBP3Qx2rGP1Qqr')
                        } catch {
                            try {
                                res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`).set('project_id', 'mainnetx2H3KfkgrzyOfbqGT24e5sGRquALPOIP')
                            } catch {}
                        }
                    }
                }
            }
        }
            //   console.log(res.body);
    //   console.log(typeof res.body.tokens)
        return metadata = res.body
    } catch (err) {
        console.error(err);
    }
};

async function getAssetAddress(asset) {
    try {
        // console.log(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`)
        let res 
        // if (iterationIndex === 1){
        //     res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`).set('project_id', 'mainnetLBmnxxr04qZ3PKvOq9MhVRrs26YwrvTB')
        //     console.log('mainnetLBmnxxr04qZ3PKvOq9MhVRrs26YwrvTB')
        // } else if (iterationIndex === 2){
        //      res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`).set('project_id', 'mainnetE4LHx84sWlx2z42F2UCSBxtxUANJpHxG')
        //     console.log('mainnetLBmnxxr04qZ3PKvOq9MhVRrs26YwrvTB')
        // } else if (iterationIndex === 3){
        //      res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}`).set('project_id', 'mainnetleZKAVNP9lIl1POXsIWIRYxxmZzIYOzx')
        //     console.log('mainnetLBmnxxr04qZ3PKvOq9MhVRrs26YwrvTB')
        // }
        try {
            res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}/addresses`).set('project_id', 'mainnetLBmnxxr04qZ3PKvOq9MhVRrs26YwrvTB')
        } catch {
            try{
                res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}/addresses`).set('project_id', 'mainnetE4LHx84sWlx2z42F2UCSBxtxUANJpHxG')
            } catch {
                try {
                    res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}/addresses`).set('project_id', 'mainnetleZKAVNP9lIl1POXsIWIRYxxmZzIYOzx')
                } catch {
                    try {
                        res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}/addresses`).set('project_id', 'mainnetfujOtIBKntd9t4gQxNOBk0j9SEdhMcv2')
                    } catch {
                        try {
                            res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}/addresses`).set('project_id', 'mainnetMb2rPO6CWD3KIsdPx1BBP3Qx2rGP1Qqr')
                        } catch {
                            try {
                                res = await superagent.get(`https://cardano-mainnet.blockfrost.io/api/v0/assets/${asset}/addresses`).set('project_id', 'mainnetx2H3KfkgrzyOfbqGT24e5sGRquALPOIP')
                            } catch {}
                        }
                    }
                }
            }
        }
            //   console.log(res.body);
    //   console.log(typeof res.body.tokens)
        return res.body
    } catch (err) {
        console.error(err);
    }
};

// getAssetMetadata('40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728436c61794e6174696f6e34313339')
module.exports.getAssetMetadata = getAssetMetadata
module.exports.getAssetAddress = getAssetAddress
module.exports.getNftNames = getNftNames

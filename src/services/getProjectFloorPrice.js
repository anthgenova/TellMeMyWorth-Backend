const apis = require("../apiServices/apis.js");

async function getProjectFloorPrice(policyId) {
    const nftTraits = await apis.getTraits(policyId, 1);
    const projectFloor = nftTraits[0].listing_lovelace / 1000000
    console.log(projectFloor)
    return projectFloor;
}
// getProjectfloorPrice('40fa2aa67258b4ce7b5782f74831d46a84c59a0ff0c28262fab21728')
exports.getProjectFloorPrice = getProjectFloorPrice;

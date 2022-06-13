const apis = require("../apiServices/apis.js");

async function getNftData(policyId, size) {
  const nftTraits = await apis.getTraits(policyId, size);
  return nftTraits;
}

exports.getNftData = getNftData;

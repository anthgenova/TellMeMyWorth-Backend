const muesliswapApi = require("../apiServices/muesliswapApi.js");

async function getTokenPrice(policyId, ticker) {
  const tokenPrice = await muesliswapApi.getTokenPrice(policyId, ticker);
  return tokenPrice;
}

// muesliswapApi.getTokenPrice('ff97c85de383ebf0b047667ef23c697967719def58d380caf7f04b64', 'SOUL')

exports.getTokenPrice = getTokenPrice;

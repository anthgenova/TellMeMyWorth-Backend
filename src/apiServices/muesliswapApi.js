const superagent = require('superagent');

// async function getTokenPrices(policyId, ticker) {
    async function getTokenPrices() {
        try {
      const res = await superagent.get(`http://analyticsv2.muesliswap.com/ticker`);
    //   console.log(res.body);
    //   console.log(typeof res.body.tokens)
      return tokens = res.body
    } catch (err) {
      console.error(err);
    }
};

async function getTokenPrice(policyId, ticker) {
    try {
  const res = await superagent.get(`http://analyticsv2.muesliswap.com/ticker`);
  console.log(res.body[`${policyId}.${ticker}_ADA`].last_price);
//   console.log(typeof res.body.tokens)
  return tokenPrice = res.body[`${policyId}.${ticker}_ADA`].last_price
} catch (err) {
  console.error(err);
}
};

// getTokenPrices()
// getTokenPrice('ff97c85de383ebf0b047667ef23c697967719def58d380caf7f04b64', 'SOUL')
module.exports.getTokenPrices = getTokenPrices
module.exports.getTokenPrice = getTokenPrice

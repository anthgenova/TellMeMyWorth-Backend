const superagent = require('superagent');

async function getTraits(policyId, size) {
  try {
    const res = await superagent.get(`https://server.jpgstoreapis.com/search/tokens?policyIds=[%22${policyId}%22]&saleType=default&sortBy=price-low-to-high&traits=%7B%7D&nameQuery=&verified=default&pagination=%7B%7D&size=${size}`);
  //   console.log(res.body.tokens);
  //   console.log(typeof res.body.tokens)
    return tokens = res.body.tokens
  } catch (err) {
    console.error(err);
  }
};

module.exports.getTraits = getTraits

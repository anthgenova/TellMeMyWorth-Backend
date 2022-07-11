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

// async function getTraits(policyId, traitType, trait) {
//   try {
//     const res = await superagent.get(`https://server.jpgstoreapis.com/search/tokens?policyIds=[%22${policyId}%22]&saleType=default&sortBy=price-low-to-high&traits=%7B${traitType}:[${trait}]%7D&nameQuery=&verified=default&pagination=%7B%7D&size=1`);
//   //   console.log(res.body.tokens);
//   //   console.log(typeof res.body.tokens)
//     return tokens = res.body.tokens
//   } catch (err) {
//     console.error(err);
//   }
// };

async function getWalletData(walletAddr) {
    try {
        const res = await superagent.get(`https://pool.pm/wallet/${walletAddr}`);
        // console.log(res.body);
        //console.log(typeof res.body.tokens)
        return  res.body
      } catch (err) {
        console.error(err);
      }
  }

// getWalletData('addr1q9vlndceqle7lsn6jcl66lrw5teamvhuwdql8e4tvzn87lh8lv920qr0tkhs6mnptv4v6aaa5pseqyxqzcdcgg49pxlq2hx6st')
//getTraits()
// superagent.get('https://api.nasa.gov/planetary/apod')
// .query({ api_key: 'DEMO_KEY', date: '2017-08-02' })
// .end((err, res) => {
//   if (err) { return console.log(err); }
//   console.log(res.body.url);
//   console.log(res.body.explanation);
// });
module.exports.getTraits = getTraits
module.exports.getWalletData = getWalletData

const apis = require("../apiServices/apis.js");

async function getMyWalletData(walletAddress) {
  const walletData = await apis.getWalletData(walletAddress);
  return walletData;
}

exports.getMyWalletData = getMyWalletData;

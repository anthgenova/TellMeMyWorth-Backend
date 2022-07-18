const { getWalletAssetValues } = require("../services/getWalletAssetValuesNew");
const { insertWalletData } = require("../services/insertWalletDataNew");
// const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/:addr", async (req, res) => {
  console.log(req.params.addr);
  const assetValueData = await getWalletAssetValues(req.params.addr);
  res.send(assetValueData);
});

router.get("/insert/:addr", async (req, res) => {
  console.log(req.params.addr);
  let walletCount = await insertWalletData(req.params.addr);
  // res.send({message:'thank you'})
  res.send({count: walletCount})
});

module.exports = router;

const { getWalletAssetValues } = require("../services/getWalletAssetValues");
const { insertWalletData } = require("../services/insertWalletData");
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
  await insertWalletData(req.params.addr);
  res.send({message:'thank you'})
});

module.exports = router;

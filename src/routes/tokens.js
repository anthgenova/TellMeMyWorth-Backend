const { getTokenPrice } = require("../apiServices/muesliswapApi.js");
// const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.get("/:policyId/:ticker", async (req, res) => {
  console.log(req.params.policyId);
  const tokenPrice = await getTokenPrice(req.params.policyId, req.params.ticker);
  res.send(tokenPrice);
});

// app.get("/api/projects/:addr", (req, res) => {
//   async function getProjects() {
//     console.log(req.params.addr);
//     const test = await mongoDbConnect.getWalletProjects(req.params.addr);
//     res.send(test);
//   }
//   getProjects();
// });
module.exports = router;

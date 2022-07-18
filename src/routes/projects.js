// const { getWalletProjects } = require("../services/getWalletProjects");
const { getWalletProjects } = require("../services/getWalletProjectsNew");
// const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

// router.get("/:addr", async (req, res) => {
//   console.log(req.params.addr);
//   const projectData = await getWalletProjects(req.params.addr);
//   res.send(projectData);
// });
router.get("/:addr", async (req, res) => {
  console.log(req.params.addr);
  const projectData = await getWalletProjects(req.params.addr);
  res.send(projectData);
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

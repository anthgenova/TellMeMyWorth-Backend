const cron = require('node-cron');
const { allUniqueNftDataInsert } = require("./src/services/getUniqueNftPolicyIds")
allUniqueNftDataInsert();
// Schedule tasks to be run on the server
cron.schedule('* * * * *', function() {
    allUniqueNftDataInsert();
})
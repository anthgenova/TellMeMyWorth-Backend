const { PolicyId } = require("../models/policyId");

async function getTokenTicker(policyId) {
  // mongoose.connect(`mongodb://localhost/TellMeMyWorth_Collections`)
  // mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
  // .then(() => console.log('Connecting to MongoDB...'))
  // .catch(err => console.error('Could not connect to MongoDB...', err));

  // Creates an Object, PolicyId, that is a Class, policyIdSchema, to correctly store the data to the correct model, 'Policy_Ids'.
  // const PolicyId = mongoose.model('Policy_Ids', policyIdSchema, 'Policy_Ids')

  // Find the policyId form the API call to jpg.store in the PolicyIds model
  const tickerFound = await PolicyId.find({
    policy_id: policyId,
  }).select({ display_name: 1 });
//   console.log('===================',tickerFound[0].display_name)

  // mongoose.disconnect();
  // console.log(policyIdFound.policy_id)
  return tickerFound[0].display_name.replaceAll(" Token", "");
}
module.exports.getTokenTicker = getTokenTicker;

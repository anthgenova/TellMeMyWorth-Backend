const { PolicyId } = require("../models/policyId");

async function getTokenPolicyIds(database = "test") {
  // mongoose.connect(`mongodb://localhost/TellMeMyWorth_Collections`)
  // mongoose.connect(`mongodb://localhost/TellMeMyWorth`)
  // .then(() => console.log('Connecting to MongoDB...'))
  // .catch(err => console.error('Could not connect to MongoDB...', err));

  // Creates an Object, PolicyId, that is a Class, policyIdSchema, to correctly store the data to the correct model, 'Policy_Ids'.
  // const PolicyId = mongoose.model('Policy_Ids', policyIdSchema, 'Policy_Ids')

  // Find the policyId form the API call to jpg.store in the PolicyIds model
  const policyIdFound = await PolicyId.find({
    traitsAreUnique: { $eq: false },
    fungible: { $eq: true },
    metaverse: { $eq: false },
  }).select({ policy_id: 1 });
  console.log(policyIdFound)

  // mongoose.disconnect();
  // console.log(policyIdFound.policy_id)
  return policyIdFound;
}
module.exports.getTokenPolicyIds = getTokenPolicyIds;

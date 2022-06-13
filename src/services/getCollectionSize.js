const { PolicyId } = require("../models/policyId");

async function getCollectionSize(policyId, database = "test") {

  // Creates an Object, PolicyId, that is a Class, policyIdSchema, to correctly store the data to the correct model, 'Policy_Ids'.
  // const PolicyId = mongoose.model('Policy_Ids', policyIdSchema, 'Policy_Ids')

  // Find the policyId form the API call to jpg.store in the PolicyIds model
  const collectionSize = await PolicyId.find({
    policy_id: { $eq: policyId },
  })
  .select({ collectionSize: 1 });

  return collectionSize;
}
module.exports.getCollectionSize = getCollectionSize;

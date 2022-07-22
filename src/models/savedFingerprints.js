const mongoose = require("mongoose");
  
const SavedFingerprint = mongoose.model(
    "Saved_Fingerprints",
    new mongoose.Schema([
        {
        fingerprint: { type: String, default: "" },
        },
    ]),
    "Saved_Fingerprints",
)

exports.SavedFingerprint = SavedFingerprint;

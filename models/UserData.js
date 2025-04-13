const mongoose = require("mongoose");

const userDataSchema = new mongoose.Schema({
  deliverableId: String,
  publishedOn: String,
  qrCodeStatus: String,
  name: String,
  id: String,
  issuedOn: String,
  validUntil: String,
  type: String,
  model: String,
  company: String,
  trainingLocation: String,
  trainer: String
});

// Avoid re-registering the model during hot reloads
module.exports = mongoose.models.userdatas || mongoose.model("userdatas", userDataSchema);

// models/UserData.js
import mongoose from "mongoose";

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

export default mongoose.models.UserData || mongoose.model("UserData", userDataSchema);

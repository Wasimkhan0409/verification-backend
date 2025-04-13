import mongoose from 'mongoose';

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
};

// Mongoose schema
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
  trainer: String,
});

const UserData = mongoose.models.UserData || mongoose.model('UserData', userDataSchema);

export default async function handler(req, res) {
  const { id } = req.query;

  await connectDB();

  try {
    const user = await UserData.findOne({ id });

    if (!user) return res.status(404).json({ error: 'No data found' });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: 'Server error' });
  }
}

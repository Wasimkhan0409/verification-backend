import mongoose from 'mongoose';
import cors from 'cors';

const mongoURI = process.env.MONGO_URI;

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    throw new Error("DB connection failed");
  }
};

// Define schema/model
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

// CORS setup
const corsOptions = {
  origin: '*',
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
};

// Main handler
export default async function handler(req, res) {
  cors(corsOptions)(req, res, async () => {
    console.log("🌐 Incoming request...");
    
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: 'Missing ID' });
    }

    try {
      await connectDB();
      const user = await UserData.findOne({ id });

      if (!user) {
        return res.status(404).json({ error: 'No data found' });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      return res.status(500).json({ error: 'Server error' });
    }
  });
}

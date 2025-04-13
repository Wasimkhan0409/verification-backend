import mongoose from 'mongoose';
import cors from 'cors';

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw new Error("Database connection failed");
  }
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

// CORS config
const corsOptions = {
  origin: '*', // <-- Development only: allows Postman, browser, etc.
  methods: ['GET'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Main handler
export default async function handler(req, res) {
  console.log("🔍 Incoming request:", {
    method: req.method,
    url: req.url,
    headers: req.headers,
  });

  // Apply CORS
  cors(corsOptions)(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'ID is required' });
    }

    try {
      await connectDB();

      const user = await UserData.findOne({ id });

      if (!user) {
        return res.status(404).json({ error: 'No data found for the given ID' });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error('❌ Error fetching user data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}

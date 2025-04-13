import mongoose from 'mongoose';
import cors from 'cors';

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw new Error("Database connection failed");
  }
};

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

// CORS options
const corsOptions = {
  origin: 'http://localhost:3000', // Allow requests from your React app running locally
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default async function handler(req, res) {
  // Apply CORS middleware
  cors(corsOptions)(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { id } = req.query;

    try {
      await connectDB();
      
      const user = await UserData.findOne({ id });

      if (!user) {
        return res.status(404).json({ error: 'No data found' });
      }

      return res.status(200).json(user);
    } catch (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  });
}

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(express.json());

// CORS config
const corsOptions = {
  origin: 'https://e-certificates.bureauveritas.com', // or http://localhost:3000
  methods: ['GET'],
  credentials: true,
};
app.use(cors(corsOptions));

// Mongo URI
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

// Schema for user data
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

// 🔐 Encryption/Decryption Utils

const SECRET_KEY = 'super-secret-password'; // Same as in your React app

// Function to decrypt the encrypted ID (slug)
function decryptID(slug) {
  const raw = Buffer.from(slug.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  const salt = raw.subarray(0, 16);
  const iv = raw.subarray(16, 32);
  const encrypted = raw.subarray(32);
  const key = crypto.scryptSync(SECRET_KEY, salt, 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, undefined, 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

// ✅ Routes

// Ping the API
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Fetch certificate by decrypted ID
app.get('/:id', async (req, res) => {
  const { id: encryptedId } = req.params;

  try {
    await connectDB();

    // Step 1: Decrypt the ID from the URL
    const originalId = decryptID(encryptedId);
    console.log('🔓 Decrypted ID:', originalId);  // Logs the decrypted ID for debugging

    // Step 2: Look up the user data by decrypted ID
    const user = await UserData.findOne({ id: originalId });
    if (!user) return res.status(404).json({ error: 'No data found' });

    // Step 3: Respond with user data
    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Error fetching data:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start the server
app.listen(5000, () => console.log('🚀 Server running on port 5000'));

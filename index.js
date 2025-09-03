import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'https://e-certificates.bureauvereite.com', // or http://localhost:3000
  methods: ['GET'],
  credentials: true,
};

app.use(cors(corsOptions));

const mongoURI = process.env.MONGO_URI;

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

app.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await connectDB();
    const user = await UserData.findOne({ id });

    if (!user) return res.status(404).json({ error: 'No data found' });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(5000, () => console.log('🚀 Server running on port 5000'));

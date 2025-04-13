require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserData = require("./models/UserData");

const app = express();

// CORS settings
const corsOptions = {
  origin: ['https://qrcode-vert-six.vercel.app/', 'http://localhost:3000'],
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// Route
app.get("/fetch/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await UserData.findOne({ id });
    if (data) {
      res.json(data);
    } else {
      res.status(404).send("❌ No data found.");
    }
  } catch (error) {
    console.error("❌ Error fetching data:", error);
    res.status(500).send("❌ Internal Server Error");
  }
});

// Export for Vercel serverless function
module.exports = app;

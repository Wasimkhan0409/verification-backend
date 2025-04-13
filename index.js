require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const connectToDatabase = require("./lib/db");
const UserData = require("./models/UserData");

const app = express();

const corsOptions = {
  origin: ['https://qrcode-vert-six.vercel.app', 'http://localhost:3000'],
  methods: ['GET'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));
app.use(express.json());

// ✅ This is your main route
app.get("/fetch/:id", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  try {
    // 👇 Ensure DB is connected efficiently
    await connectToDatabase();

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

// 👇 Export for Vercel Serverless
module.exports = serverless(app);

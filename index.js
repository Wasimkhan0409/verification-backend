require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserData = require("./models/UserData");

const app = express(); // ✅ Move this above `app.use(...)`

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Route to fetch data by unique ID
    app.get("/fetch/:id", async (req, res) => {
      try {
        const { id } = req.params;
        console.log("Searching for ID:", id);

        const data = await UserData.findOne({ id });
        console.log("Result:", data);

        if (data) {
          res.json(data);
        } else {
          res.status(404).send("❌ No data found with the given ID.");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).send("❌ Error fetching data.");
      }
    });

    // Start the server
    app.listen(5000, "0.0.0.0", () => {
      console.log("🚀 Server running on all interfaces at port 5000");
    });
    
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

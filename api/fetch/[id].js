const mongoose = require("mongoose");
const UserData = require("../../models/UserData");

// Cached DB connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await connectToDatabase();

    const {
      query: { id },
    } = req;

    const data = await UserData.findOne({ id });

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("❌ API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

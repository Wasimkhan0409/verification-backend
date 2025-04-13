// pages/api/userDate/[id].js
import dbConnect from "../../../lib/dbConnect";
import UserData from "../../../models/UserData";

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    await dbConnect(); // Connect to MongoDB

    const { id } = req.query;
    const data = await UserData.findOne({ id });

    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

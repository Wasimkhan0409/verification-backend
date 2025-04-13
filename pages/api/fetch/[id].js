export default async function handler(req, res) {
  console.log("Query received:", req.query);

  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    await dbConnect();
    const { id } = req.query;

    console.log("Looking for ID:", id);
    const data = await UserData.findOne({ id });

    if (!data) {
      console.log("No data found for ID:", id);
      return res.status(404).json({ message: "Data not found" });
    }

    console.log("Data found:", data);
    return res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

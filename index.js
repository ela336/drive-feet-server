const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors")
require("dotenv").config();

const app = express();

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT;

const client = new MongoClient(process.env.MONGODB_URI);

async function connectToMongoDB() {
  try {
    await client.connect();

    const db = client.db("drivefeet")
    const cardetailscollection = db.collection("cardetails")

    app.post('/cardetails',async(req,res)=>{
      const details = req.body
      const result = await cardetailscollection.insertOne(details)

      res.json(result)
    })




    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
}

connectToMongoDB();

app.get("/", (req, res) => {
  res.send("DriveFleet Server is running");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
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
    const bookingcollection = db.collection("bookings")
    

     app.get('/cardetails',async(req,res)=>{
      const result = await cardetailscollection.find().toArray();
      res.json(result)
    })

    app.get('/cardetails/:id',async(req,res)=>{
      const {id} = req.params
      const result = await cardetailscollection.findOne({_id:new ObjectId(id)})

      res.json(result)

    })

    app.patch('/cardetails/:id',async(req,res)=>{
      const {id} = req.params
      const update = req.body
      const result = await cardetailscollection.updateOne({_id:new ObjectId(id)}, {$set: update})

      res.json(result)

    })

    app.post('/cardetails',async(req,res)=>{
      const details = req.body
      const result = await cardetailscollection.insertOne(details)

      res.json(result)
    })

     app.get('/myadded/:userid',async(req,res)=>{
      const {userid} = req.params
      const result = await cardetailscollection.find({userid}).toArray()

      res.json(result)

    })

     app.get('/bookings/:userid',async(req,res)=>{
      const {userid} = req.params
      const result = await bookingcollection.find({userid}).toArray()

      res.json(result)

    })
   
    app.post('/bookings',async(req,res)=>{
      const details = req.body
      const result = await bookingcollection.insertOne(details)

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
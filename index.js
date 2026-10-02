const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const { createRemoteJWKSet, jwtVerify } = require("jose-cjs");
require("dotenv").config();

const app = express();

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT;

const client = new MongoClient(process.env.MONGODB_URI);
const JWKS = createRemoteJWKSet(
  new URL("http://localhost:3000/api/auth/jwks")
)

const verifytoken = async (req, res, next) => {
       const authHeader = req?.headers.authorization
       if(!authHeader){
        res.status(401).json({error: "Unauthorized"})
        return
       }
       const token = authHeader?.split(" ")[1];
       if(!token){
        res.status(401).json({error: "Unauthorized"})
        return
       }


     try{
       const {payload} =await  jwtVerify(token,JWKS)
       
     }
     catch(err){
        return res.status(403).json({error: "Invalid token"})
     }
      
        next()
      
         
       
       

    }

async function connectToMongoDB() {
  try {
    await client.connect();

    const db = client.db("drivefeet")
    const cardetailscollection = db.collection("cardetails")
    const bookingcollection = db.collection("bookings")
    

     app.get('/cardetails',verifytoken,async(req,res)=>{
      const result = await cardetailscollection.find().toArray();
      res.json(result)
    })

    app.get('/cardetails/:id',verifytoken,async(req,res)=>{
      const {id} = req.params
      const result = await cardetailscollection.findOne({_id:new ObjectId(id)})

      res.json(result)

    })

    app.patch('/cardetails/:id',verifytoken,async(req,res)=>{
      const {id} = req.params
      const update = req.body
      const result = await cardetailscollection.updateOne({_id:new ObjectId(id)}, {$set: update})

      res.json(result)

    })

    app.delete('/cardetails/:id',verifytoken,async(req,res)=>{
      const {id}=req.params
      const result = await cardetailscollection.deleteOne({_id:new ObjectId(id)})
      res.json(result)
    })

    app.post('/cardetails',verifytoken,async(req,res)=>{
      const details = req.body
      const result = await cardetailscollection.insertOne(details)

      res.json(result)
    })

     app.get('/myadded/:userid',verifytoken,async(req,res)=>{
      const {userid} = req.params
      const result = await cardetailscollection.find({userid}).toArray()

      res.json(result)

    })

     app.get('/bookings/:userid',verifytoken,async(req,res)=>{
      const {userid} = req.params
      const result = await bookingcollection.find({userid}).toArray()

      res.json(result)

    })
   
    app.post('/bookings',verifytoken,async(req,res)=>{
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
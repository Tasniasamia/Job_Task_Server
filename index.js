const express = require('express')
const cors = require('cors');

const app = express();
app.use(cors())
app.use(express.json())

// Enable CORS for all routes

const port = 6030
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ioy1chb.mongodb.net/?retryWrites=true&w=majority`;

console.log(uri);

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("First_Job_Task");
    const Form = database.collection("FormData");

    app.post('/Tasks',async(req,res)=>{
        const data=req.body;
        if(!data){
            return   res.send({error:true,message:"There is no Data"})
        }
        console.log("data",data);
        const result = await Form.insertOne(data);
        console.log(result);
        res.send(result);
    })
    app.get('/TasksCollection',async(req,res)=>{
        const result=await Form.find().toArray();
        if(!result){
            return   res.send({error:true,message:"There is no Data into Database"})

        }
        res.send(result);

    })
    app.delete('/Taskdelete/:id',async(req,res)=>{
        const id=req.params.id;
        const query = {_id:new ObjectId(id)}
        const result = await Form.deleteOne(query);
        if(result.deletedCount==0){
            return   res.send({error:true,message:"There is no Delete Data into Database"})

        }
        res.send(result)
    })
    app.patch("/StatusUpdate/:id",async(req,res)=>{
        const id=req.params.id;
        const data=req.body;
        const query={_id:new ObjectId(id)}
        const options = { upsert: true };


        const updateDoc = {

            $set: {
        
              
              ...data
        
              
             
        
            },
        
          };
const result=await Form.updateOne(query,updateDoc,options);
if(result.modifiedCount== 0){
    return   res.send({error:true,message:"There is no  Data Updated into Database"})

}
console.log(result);
res.send(result);
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
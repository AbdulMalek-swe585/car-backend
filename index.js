const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
// app.use(express.json());
// process.env.PORT  || 
const port =process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nasnt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



async function run() {
    try {
        await client.connect();
// this is p
        const database = client.db("carCollection");
        const carCollection = database.collection('carProducts');
        const orderCollection = database.collection('ordersProduct');
       const usersCollection = database.collection('orderCollection'); 
       const reviewCollection = database.collection('reviewCollection'); 
        
        //   get product from databasae 

        app.get('/products',async(req,res)=>{
            // console.log('this is hit');
           const user = req.body;
          //  console.log(user);
           const cursor = carCollection.find(user);
           const result = await cursor.toArray();
           res.json(result);

        })
        app.get('/products/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await carCollection.findOne(query);
            // console.log(result);
            res.json(result);
        })

        // order data set 
        app.post('/products' , async (req,res)=>{
          const product = req.body;
          const result = await carCollection.insertOne(product);
          console.log(product);
          res.json(result);
    
        })
        app.post('/orders' , async (req,res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.json(result);
      
          })
         
          app.get('/orders' ,async(req,res)=>{
            const cursor = orderCollection .find({});
            const result = await cursor.toArray();
            // console.log(result);
            res.json(result);
          })
          app.get('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await orderCollection.findOne(query);
            // console.log(result);
            res.json(result);
        })
          app.delete('/orders/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await orderCollection.deleteOne(query);
            //console.log("thdi",result);
            res.json(result);
          })

        //  admin and user site work 
        app.get('/users/:email',async(req,res)=>{
          const email = req.params.email;
          const query = {email : email};
          const result = await usersCollection.findOne(query);
          let isAdmin =false;
          if(result?.role==='admin'){
              isAdmin=true;
          }
          console.log(result);
          res.json(result);
      })


        app.post('/users' ,async(req,res)=>{
          const order = req.body;
            const result = await usersCollection.insertOne(order);
            res.json(result);
        })
       
        app.put('/users/admin',async(req,res)=>{
          const user = req.body;
          const filter = {email : user.email};
          const updateDoc = {$set : {role:'admin'}};
          const result = await usersCollection.updateOne(filter,updateDoc);
          res.json(result);
      })

      app.post('/review' , async (req,res)=>{
        const product = req.body;
        const result = await reviewCollection.insertOne(product);
        console.log(product);
        res.json(result);
  
      })
      app.get('/review',async(req,res)=>{
        // console.log('this is hit');
       const user = req.body;
      //  console.log(user);
       const cursor = reviewCollection.find(user);
       const result = await cursor.toArray();
       res.json(result);

    })
}
finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('hitting the power');
})
 
app.listen(port,()=>{
    console.log("hitting the beackend door",port);
})





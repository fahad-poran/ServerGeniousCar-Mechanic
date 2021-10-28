//5 things to do
// import { MongoClient } from "mongodb";
const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
//user geniousMachanic
//password JBBb4Qd8j37NIxi9
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xc3fq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

async function run(){
    try{
        await client.connect();
        // console.log('connected');
        //set in the collection
        const database = client.db('carmachanic'); // name of db Dont to create manually on server!
        const servicesCollection = database.collection('services'); // all the services will be here! //like table name


        //get api
        app.get('/services',async(req,res)=>
        {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);// successfully loaded from mongodb 
        })

        //get single service
        app.get('/service/:id',async(req,res)=>{
            //dynamic id capture
            const id= req.params.id;
            console.log('gettring specific service id',id);
            const query = {_id: ObjectId(id)};
            const service = await servicesCollection.findOne(query); // query id willbe sent
            res.json(service); //show result;
        })

        //post api
        app.post('/services',async(req,res)=>

        {   console.log('hitting the post');

            const service = req.body;
            console.log('hit the post api',service);
            const services = { //like instead of doc
                // "name": "ENGINE DIAGNOSTIC",
                // "price": "300",
                // "description": "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
                // "img": "https://i.ibb.co/dGDkr4v/1.jpg"  
            }   
            res.send('post hitte');
            //now to see weather it is ok or not !! the connection
           const result = await servicesCollection.insertOne(service);
           console.log(result);
            res.json(result);
        });
        
//delete operation

        app.delete('/services/:id',async(req,res)=>{
            const id= req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })


        app.get('/service',(req,res)=>{
            res.send('hi there!');
        })
    }
finally{
    // await client.close();
}
}
run().catch(console.dir); 
//default route

app.get('/root',(req,res)=>{
    //server will sent req (params ,querey, ...) 
    //ress => return (many things sent string / js=> res.json ...)

    res.send('running genius server');

});

app.listen(port,()=> {
    console.log('running genius on port ',port);
})
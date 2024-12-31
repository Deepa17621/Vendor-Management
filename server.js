const express = require('express');
const { MongoClient , ObjectId} = require('mongodb');
require('dotenv').config();
const path = require('path');

const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use('/assests', express.static(path.join(__dirname, 'assests')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/html', express.static(path.join(__dirname, 'html')));

const uri = process.env.MONGO_DB_URI;
const client = new MongoClient(uri);
let database;
async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        database = client.db('vendormanagement')
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err.message);
    }
}
connectToMongoDB(); 

// Post
app.post('/post/:module', async (req, res) => {
    try {
        const { module }=req.params;
        const obj = req.body;
        const result = await database.collection(module).insertOne(obj);
        res.status(201).send({ id: result.insertedId, message: `Successfully inserted!` });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ message: 'Error creating ' });
    }
});

//Get By Id
app.get('/getById/:module/:id', async(req, res)=>{
    try {
        const { module , id}=req.params;
        const result=await database.collection(module).findOne({_id:new ObjectId(id)});
        if(!result){
            return res.status(404).send({message: `${module} not Found!`});
        }
        res.send(result);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).send({ message: 'Error fetching user by ID' });
    }
});
app.get('/getByKey/:module/:value/:keyy', async (req, res) => {
    try {
        const { module, value, keyy } = req.params;
        console.log(keyy);
        console.log(value);
        const result = await database.collection(module).findOne({ [keyy]: value }); 
        if (!result) {
            console.log(result);
            
            return res.send({message:false});
        }
        console.log(result);
        
        res.send(result);
    } catch (error) {
        console.error("Error fetching by value:", error);
        res.status(500).send({ message: 'Error fetching by value' });
    }
});

//Get All
app.get('/getAll/:module', async(req,res)=>{
    try {
        const { module }=req.params;
        const listOfUsers = await database.collection(module).find({}).toArray();
        if(listOfUsers) res.json(listOfUsers);
        else throw new Error(listOfUsers.status)
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: 'Error fetching users' });
    }
});


// Update
app.put('/update/:module/:id', async (req, res) => {
    try {
        const {module, id} = req.params;
        const updateUser = req.body;
        await database.collection(module).updateOne({ _id: new ObjectId(id) }, { $set: updateUser });
        res.send({ message: `user Updated!` });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: 'Error updating user' });
    }
});
//upodate - send obj, using another key
app.put('/updateExObj/:module/:key/:value', async (req, res) => {
    try {
        const {module, key, value} = req.params;
        const updateUser = req.body;
        await database.collection(module).updateOne({key:value }, { $set: updateUser }, { upsert: true });
        res.send({ message: `user Updated!` });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: 'Error updating user' });
    }
});
// Update-Service
app.put('/updateService/:module/:serviceName/:vendorId/:flag', async (req, res) => {
    try {
        const {module, serviceName, vendorId, flag} = req.params;
        if(flag){
            await database.collection(module).updateOne({ service: serviceName }, { $addToSet: {vendors:vendorId} }, { upsert: true } );
            res.send({ message: `user Updated!` });
        }
        else{
            await database.collection(module).insertOne({service: serviceName,vendors: [vendorId],});
            res.send({ message: `user Updated!` });
        }

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send({ message: 'Error updating user' });
    }
});
// Delete
app.delete('/delete/:module/:id', async (req, res) => {
    try {
        const { module , id}=req.params;
        await database.collection(module).deleteOne({ _id: new ObjectId(id) });
        res.send({ message: `User Deleted!` });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).send({ message: 'Error deleting user' });
    }
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))});
// Start the server
app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
})
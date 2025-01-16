import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';


dotenv.config();


const app = express();
const port = process.env.PORT || 3000;
app.use(bodyParser.json());
app.use(cors());

const url = process.env.MONGO_URI;
const dbName = 'passop';

async function startServer() {
    try {
        const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('passwords');

        // Sample Data Insertion (optional for testing)
        await collection.insertMany([{ name: 'Sample1' }, { name: 'Sample2' }]);

        // Routes
        app.get('/', async (req, res) => {
            try {
                const documents = await collection.find({}).toArray();
                res.json(documents);
            } catch (err) {
                console.error('Error retrieving documents:', err);
                res.status(500).send('Internal Server Error');
            }
        });
        

        app.post('/', async (req, res) => {
            try {
                const password= req.body;
                const documents = await collection.insertOne(password);
                res.send({success:true, result:findResult});
            } catch (err) {
                console.error('Error retrieving documents:', err);
                res.status(500).send('Internal Server Error');
            }
        });

        app.delete('/', async (req, res) => {
            try {
                const password= req.body;
                const documents = await collection.deleteOne(password);
                res.send({success:true, result:findResult});
            } catch (err) {
                console.error('Error retrieving documents:', err);
                res.status(500).send('Internal Server Error');
            }
        });

        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
}

startServer();
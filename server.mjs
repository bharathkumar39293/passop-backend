import express from 'express';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

const url = process.env.MONGO_URI;
const dbName = 'passop';

async function startServer() {
    try {
        const client = new MongoClient(url, {
            serverSelectionTimeoutMS: 50000 // Increase the timeout to 50 seconds
          });
        await client.connect();
        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('passwords');

        // Routes
        app.get('/passwords', async (req, res) => {
            try {
                const documents = await collection.find({}).toArray();
                res.json(documents);
            } catch (err) {
                console.error('Error retrieving documents:', err);
                res.status(500).send('Internal Server Error');
            }
        });

        app.post('/update', async (req, res) => {
            try {
                const password = req.body;
                const insertResult = await collection.insertOne(password);
                res.json({ success: true, result: insertResult });
            } catch (err) {
                console.error('Error inserting document:', err);
                res.status(500).send('Internal Server Error');
            }
        });

        app.delete('/delete', async (req, res) => {
            try {
                const password = req.body;
                const deleteResult = await collection.deleteOne(password);
                res.json({ success: true, result: deleteResult });
            } catch (err) {
                console.error('Error deleting document:', err);
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

export default app;

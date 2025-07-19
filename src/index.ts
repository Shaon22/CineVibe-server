import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const dbName = process.env.DB_NAME;

if (!username || !password || !dbName) {
  throw new Error("Missing MongoDB environment variables in .env");
}

// Build URI dynamically
const uri = `mongodb+srv://${username}:${password}@cluster0.sykxlbw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create MongoClient with options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Main function
async function run() {
  try {
    await client.connect();
    // Ping the admin DB
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");

    const db = client.db(dbName);

    // Example route
    app.get('/', async (req: Request, res: Response) => {
      const data = await db.collection('users').find().toArray();
      res.json(data);
    });

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });

  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

run().catch(console.dir);

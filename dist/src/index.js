"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors = require("cors");
const dotenv_1 = __importDefault(require("dotenv"));
const mongodb_1 = require("mongodb");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 5000;
const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;
const dbName = process.env.DB_NAME;
if (!username || !password || !dbName) {
    throw new Error("Missing MongoDB environment variables in .env");
}
// middlewares
app.use(cors());
app.use(express_1.default.json());
// Build URI dynamically
const uri = `mongodb+srv://${username}:${password}@cluster0.sykxlbw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create MongoClient with options
const client = new mongodb_1.MongoClient(uri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
// Main function
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const movieCollection = client.db("CineVibe").collection("movies");
            const seriesCollection = client.db("CineVibe").collection("series");
            const blogsCollection = client.db("CineVibe").collection("blogs");
            // Ping the admin DB
            yield client.db("admin").command({ ping: 1 });
            console.log("✅ Successfully connected to MongoDB!");
            const db = client.db(dbName);
            // Example route
            app.get("/allMovies", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = movieCollection.find();
                const result = yield cursor.toArray();
                res.send(result);
            }));
            app.get("/allMovies/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const id = req.params.id;
                const query = { _id: new mongodb_1.ObjectId(id) };
                const result = yield movieCollection.findOne(query);
                res.send(result);
            }));
            app.get("/allSeries", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = seriesCollection.find();
                const result = yield cursor.toArray();
                res.send(result);
            }));
            app.get("/allSeries/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const id = req.params.id;
                const query = { _id: new mongodb_1.ObjectId(id) };
                const result = yield seriesCollection.findOne(query);
                res.send(result);
            }));
            app.get("/allBlogs", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const cursor = blogsCollection.find();
                const result = yield cursor.toArray();
                res.send(result);
            }));
            app.get("/allBlogs/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
                const id = req.params.id;
                const query = { _id: new mongodb_1.ObjectId(id) };
                const result = yield blogsCollection.findOne(query);
                res.send(result);
            }));
            app.get("/", (req, res) => {
                res.send("CineVibe Server is running!");
            });
            app.listen(port, () => {
                console.log(`Server running at http://localhost:${port}`);
            });
        }
        catch (err) {
            console.error("MongoDB connection error:", err);
            process.exit(1);
        }
    });
}
run().catch(console.dir);

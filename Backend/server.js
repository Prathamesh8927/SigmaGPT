import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import chatRoutes from "./routes/chat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express(); 
const port = 8080;
const localMongoUri = "mongodb://127.0.0.1:27017/sigmagpt";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api",chatRoutes);
 
const connectDb = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sigmagpt";

        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 15000,
        });
        console.log("Connected with Database");
        
    } catch (err) {
        console.error("Failed to connect with DB:",err);
    }
};

    app.listen(port, () => {
        console.log(`Server running on ${port}`);
        connectDb();
    });
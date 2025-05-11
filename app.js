import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import scanRoutes from "./routes/scan.js";  
import productsRoutes from "./routes/products.js";   
dotenv.config();

const app = express();
const port = process.env.PORT || 2000;
const mongodb = process.env.MONGODB_CONNECTION;

app.use(cors());
app.use(express.json());

app.use("/scan", scanRoutes);
app.use("/products", productsRoutes);   

app.get("/", (req, res) => {
    res.send("Welcome to the smart shopping system!");
});

// MongoDB connection options
const connectOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000, // Socket timeout
    connectTimeoutMS: 30000, // Connection timeout
    retryWrites: true,
    retryReads: true
};

// Connection function with retry logic
const connectWithRetry = async () => {
    console.log('Attempting MongoDB connection...');
    try {
        // Log the first few characters of the connection string for debugging
        // (avoid logging the entire string for security reasons)
        console.log(`MongoDB URI starts with: ${mongodb?.substring(0, 10)}...`);
        
        await mongoose.connect(mongodb, connectOptions);
        console.log("Connected to MongoDB Atlas successfully");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        console.log("Retrying connection in 5 seconds...");
        setTimeout(connectWithRetry, 5000);
    }
};

// Add MongoDB connection event listeners
mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error occurred:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected. Attempting to reconnect...');
    setTimeout(connectWithRetry, 5000);
});

// Start the connection process
connectWithRetry();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
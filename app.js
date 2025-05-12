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

// Updated CORS configuration for production
const allowedOrigins = [
  'https://cart-frontend-ten.vercel.app', // Production frontend
  'http://localhost:3000'                 // Local development frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

app.use("/scan", scanRoutes);
app.use("/products", productsRoutes);

app.get("/", (req, res) => {
    res.send("Welcome to the smart shopping system!");
});

mongoose.connect(mongodb).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
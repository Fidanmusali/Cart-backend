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

mongoose.connect(mongodb).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
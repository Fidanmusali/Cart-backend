import express from "express";
import CartItem from "../models/cartItem.js";

const router = express.Router();

// Get all items in cart
router.get("/", async (req, res) => {
  try {
    const items = await CartItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
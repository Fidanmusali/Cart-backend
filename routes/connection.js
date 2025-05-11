import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/connection-token", async (req, res) => {
  try {
    const connectionToken = await stripe.terminal.connectionTokens.create();
    res.json({ secret: connectionToken.secret });
  } catch (error) {
    console.error("Error creating connection token:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/register-reader", async (req, res) => {
  try {
    const { registration_code, label } = req.body;
    
    const reader = await stripe.terminal.readers.create({
      registration_code,
      label,
    });
    
    res.json({ success: true, reader });
  } catch (error) {
    console.error("Error registering reader:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/readers", async (req, res) => {
  try {
    const readers = await stripe.terminal.readers.list({
      limit: 10,
    });
    
    res.json({ readers: readers.data });
  } catch (error) {
    console.error("Error fetching readers:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

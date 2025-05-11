import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Stripe Checkout Session üçün endpoint
router.post("/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Node.js and Express book',
          },
          unit_amount: 5000, // 50.00 USD
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success`,
      cancel_url: `${req.headers.origin}/cancel`,
    });

    res.send({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create payment intent for online transactions
router.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;
    
    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: error.message });
  }
});

// Create payment intent for in-person transactions (terminal)
router.post("/create-terminal-payment", async (req, res) => {
  try {
    const { amount, currency = "usd" } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      payment_method_types: ["card_present"],
      capture_method: "manual"
    });
    
    res.json({ 
      client_secret: paymentIntent.client_secret, 
      payment_intent_id: paymentIntent.id 
    });
  } catch (error) {
    console.error("Error creating terminal payment:", error);
    res.status(500).json({ error: error.message });
  }
});

// Capture a payment intent
router.post("/capture-payment/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const paymentIntent = await stripe.paymentIntents.capture(id);
    res.json({ success: true, paymentIntent });
  } catch (error) {
    console.error("Error capturing payment:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
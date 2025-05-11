import express from "express";
import Product from "../models/product.js";
import CartItem from "../models/cartItem.js";

const router = express.Router();

router.post("/", async (req, res) => {   
  const { barcode } = req.body;

  const product = await Product.findOne({ barcode });

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  const item = new CartItem({
    productId: product.id,
    name: product.name,
    price: product.price,
  });

  await item.save();
  res.json({ success: true, product: item });
});

export default router;

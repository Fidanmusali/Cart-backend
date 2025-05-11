import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true }
});

const CartItem = mongoose.model("CartItem", cartItemSchema);
export default CartItem;
import mongoose from "mongoose";

// Define the document shape + validation
export const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // string, required, trims whitespace
    price: { type: Number, required: true, min: 0 }, // number, required, must be >= 0
  },
  { timestamps: true } // adds createdAt/updatedAt fields automatically
);

// Create the Model (class) from the schema.
// "Product" is the *model name*; Mongoose will use the "products" collection by default.
const Product = mongoose.model("Product", productSchema);

// Use this default export in your code: import Product from './product.model.js'
export default Product;

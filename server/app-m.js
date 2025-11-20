import "dotenv/config";

import express from "express";
import mongoose from "mongoose";

import { createProduct, getProducts } from "./mongoose.js";

const app = express();
app.use(express.json());

app.get("/products", getProducts);
app.post("/products", createProduct);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("Missing MONGODB_URI");
    }
    await mongoose.connect(process.env.MONGODB_URI, { dbName: "places" });
    console.log("Connected to MongoDb!");
    app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
  } catch (err) {
    console.error("DB connection failed", err);
    process.exit(1);
  }
};

start();

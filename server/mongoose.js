import Product from "./models-m/product.js";

const url = process.env.MONGODB_URI;
if (!url) {
  throw new Error("Missing MONGODB_URI in environment");
}
/*
try {
  // Connect backend to MongoDB database (with explicit db name)
  await mongoose.connect(url, { dbName: "products_test" });
  console.log("Connected to the database!");
} catch (err) {
  console.error("Failed to connect", err);
  process.exit(1); // Stop app if DB isn’t reachable
}*/

// Route handler: create a product
export const createProduct = async (req, res) => {
  // Extract data from request body
  const { name, price } = req.body;

  // Quick input validation
  const priceNum = Number(price);
  if (typeof name !== "string" || Number.isNaN(priceNum)) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  try {
    // Create and save in one step (equivalent to new Product + save)
    const doc = await Product.create({ name, price });

    // REST convention: tell client where new resource lives
    res.set("Location", `/products/${doc._id}`);

    // 201 Created + return created product
    return res.status(201).json(doc);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation failed", details: err.errors });
    }
    return res.status(500).json({ message: "Could not store the data." });
  }
};

export const getProducts = async (_req, res, next) => {
  const products = await Product.find().exec();
  res.json(products);
};

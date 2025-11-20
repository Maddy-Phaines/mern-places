// mongo.js
// --- Imports ---
import { MongoClient } from "mongodb"; // Official low-level MongoDB driver for Node
import "dotenv/config"; // Loads environment variables from .env into process.env

// --- Connection string ---
// Best practice: never hard-code secrets (URI, usernames, passwords). Put them in .env.
// Example .env line: MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
const url = process.env.MONGODB_URI;

// ===============================
// Create (POST /products)
// ===============================
export const createProduct = async (req, res) => {
  // The document we want to insert into the 'products' collection.
  // In MongoDB terms, a "document" is just a plain JS object.
  const newProduct = {
    name: req.body.name,
    price: req.body.price,
  };

  // Create a client that knows how to talk to your MongoDB cluster using the URL above.
  // (Think of this like preparing a database connection.)
  const client = new MongoClient(url);

  try {
    // 1) Connect to MongoDB. You must be connected before any read/write operation.
    await client.connect();

    // 2) Choose the database you want to work with.
    // If your URI includes a default DB, you could omit the name here.
    const db = client.db("products_test");

    // 3) Choose the collection (roughly analogous to a SQL table).
    // 4) Insert ONE new document into that collection.
    // `insertOne` returns an object with the generated `_id` for the new document.
    const result = await db.collection("products").insertOne(newProduct);

    // (Optional but recommended for REST): Tell the client where the new resource lives.
    // E.g. GET /products/<the new id>
    res.set("Location", `/products/${result.insertedId}`);

    // Respond with HTTP 201 (Created) and include both the original fields and the new MongoDB _id.
    // Spreading `newProduct` keeps what the client sent; `_id` is the authoritative id created by MongoDB.
    return res.status(201).json({ ...newProduct, _id: result.insertedId });
  } catch (error) {
    // If anything above throws (e.g., network issue, validation you add later),
    // let the client know it’s a server error.
    return res.status(500).json({ message: "Could not store the data" });
  } finally {
    // Always close the client so sockets aren’t left hanging open.
    // (In larger apps you typically connect once at startup and reuse the client instead.)
    await client.close();
  }

  // NOTE: Do not send another response here; we already returned inside try/catch.
};

// ===============================
// Read (GET /products)
// ===============================
export const getProducts = async (req, res) => {
  const client = new MongoClient(url);

  try {
    // 1) Connect to the cluster
    await client.connect();

    // 2) Pick the database
    const db = client.db("products_test");

    // 3) Query the collection.
    // `find()` returns a cursor (a pointer to results); `.toArray()` pulls them into a JS array.
    const products = await db.collection("products").find().toArray();

    // 4) Send the documents to the client as JSON
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ message: "Could not retrieve products." });
  } finally {
    await client.close();
  }
};

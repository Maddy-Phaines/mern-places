import express from "express";
import HttpError from "./models/http-error.js";
import placesRoutes from "./routes/places-routes.js";
import usersRoutes from "./routes/users-routes.js";
import "dotenv/config";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const app = express(); // returns app object
app.use(express.json()); // parses the JSON body -> req.body

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/places", placesRoutes); // forwards the request to the router /api/places...
app.use("/api/users", usersRoutes);
app.use("/uploads/images", express.static(path.join("uploads", "images")));

// 404 handler
app.use((req, res, next) => {
  const error = new HttpError("No route found.", 404);
  throw error;
});
// Global error handler
app.use((err, req, res, next) => {
  // rollback image file upload if we have a validation error
  if (req.file)
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  if (res.headersSent) {
    return next(err);
  }

  // 1. Mongo duplicate key error (e.g. unique email violation)
  if (err && err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({
      message: `Duplicate value for ${field}.`,
    });
  }

  // 2. HttpError or other app errors
  const status =
    typeof err.code === "number" && err.code >= 400 && err.code < 600
      ? err.code
      : 500;

  return res
    .status(status)
    .json({ message: err.message || "An unknown error has occurred!" });
});

const PORT = process.env.PORT || 5000;

const main = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("Missing MONGODB_URI");
    await mongoose.connect(uri, { dbName: "mern" });
    console.log("Connected to MongoDb!");

    app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
  } catch (err) {
    console.error("Failed to connect to MongoDb.", err);
    process.exit(1);
  }
};
main();

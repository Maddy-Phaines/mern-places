import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, trim: true, minLength: 8 },
    image: { type: String, required: false, trim: true },
    places: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
  }
);

// Create the Model (class) from the schema.
const User = mongoose.model("User", userSchema);

export default User;

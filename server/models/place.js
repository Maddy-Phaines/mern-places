import mongoose from "mongoose";

const Schema = mongoose.Schema;
// Define the document shape + validation
const placeSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    location: {
      type: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      required: true,
    },
    image: { type: String, required: false },
    address: { type: String, required: true },
    creator: { type: String, required: true },

    // creator: { type: mongoose.Types.ObjectId, required: true },
  },
  { timestamps: true } // adds createdAt/updatedAt fields automatically
);

// Create the Model (class) from the schema.
const Place = mongoose.model("Place", placeSchema);
// Use this default export in your code: import Place from './place.model.js'
export default Place;

// controllers/places-controllers.js
import HttpError from "../models/http-error.js";
import { getCoordinatesFromAddress } from "../util/location.js";
import Place from "../models/place.js";

import { v4 as uuidv4 } from "uuid";

const DUMMY_PLACES = [
  {
    id: uuidv4(),
    title: "Empire State Building",
    description: "...",
    location: { lat: 40.7484405, lng: -73.9856644 },
    address: "20 W 34th St., New York, NY 10001, United States",
    creator: "u1", // <-- must be exactly "u1"
  },
  {
    id: uuidv4(),
    title: "Something else",
    description: "...",
    location: { lat: 40.7484405, lng: -73.9856644 },
    address: "20 W 34th St., New York, NY 10001, United States",
    creator: "u2",
  },
];
// find id of the creator
export const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  console.log("user id is:", userId);
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    console.error("Something went wrong.", err);
    const error = new HttpError("Something went wrong. Place not found.", 500);
    return next(error);
  }

  if (places.length === 0) {
    return next(new HttpError("No places found for the user id provided", 404));
  }

  return res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

export const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.error("Something went wrong.", err);
    const error = new HttpError("No place found.", 500);
    return next(error);
  }

  if (!place) {
    return next(new HttpError("A place was not found for that id.", 404));
  }
  console.log({ place: place.toObject() });
  return res.json({ place: place.toObject({ getters: true }) });
};

export const createPlace = async (req, res, next) => {
  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordinatesFromAddress(address);
  } catch (error) {
    return next(
      new HttpError(
        error.message || "Failed to retrieve coordinates for the given address"
      )
    );
  }

  // TODO(ev): remove once express-validator covers this
  if (!title || !description || !address || !creator) {
    return next(new HttpError("Missing required fields.", 422));
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://en.wikipedia.org/wiki/Empire_State_Building_in_popular_culture#/media/File:Empire_State_Building_(aerial_view).jpg",
    creator,
  });

  try {
    await createdPlace.save();
    console.log("Place created.");
  } catch (err) {
    console.log("Mongoose save error:", err);
    const error = new HttpError(
      "Creating place failed. Please try again.",
      500
    );
    return next(error);
  }

  return res.status(201).json({ place: createdPlace });
};

/**
 * PATCH /api/places/:pid
 *
 * Partially updates a place's title and/or description.
 * - Rejects empty strings.
 * - At least one of {title, description} must be valid.
 */
export const updatePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  const { title, description } = req.body;

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.error("Something went wrong:", err);
    // Database or cast error → treat as 500
    const error = new HttpError(
      "Something went wrong. Could not update place",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(new HttpError("No place found with the provided id", 404));
  }

  // ---- Input validation & normalization ----
  const titleTrimmed = typeof title === "string" ? title.trim() : undefined;
  const titleValid = typeof title === "string" && titleTrimmed.length > 0;
  const titleInvalid = typeof title === "string" && titleTrimmed.length === 0;

  const descriptionTrimmed =
    typeof description === "string" ? description.trim() : undefined;
  const descriptionValid =
    typeof description === "string" && descriptionTrimmed.length > 0;
  const descriptionInvalid =
    typeof description === "string" && descriptionTrimmed.length === 0;

  if (titleInvalid || descriptionInvalid) {
    // Disallow explicitly empty strings, e.g. "   "
    return next(
      new HttpError("Provided fields must be non-empty strings.", 422)
    );
  }

  if (!titleValid && !descriptionValid) {
    // No valid fields provided → nothing to update
    return next(new HttpError("No valid fields to update.", 422));
  }

  // ---- Apply updates to the Mongoose document ----
  if (titleValid) {
    place.title = titleTrimmed;
  }

  if (descriptionValid) {
    place.description = descriptionTrimmed;
  }

  try {
    await place.save();
  } catch (err) {
    console.error("Something went wrong:", err);
    const error = new HttpError(
      "Something went wrong. Unable to update place.",
      500
    );
    return next(error);
  }

  // Serialize Mongoose document to a plain object with `id` instead of `_id`
  return res.status(200).json({ place: place.toObject({ getters: true }) });
};

export const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    console.log("Something went wrong. Unable to delete item.", 500);
    const error = new HttpError(
      "Something went wrong. Unable to delete place.",
      500
    );
    return next(error);
  }

  if (!place) {
    return next(new HttpError("No place found with the provided id.", 404));
  }

  try {
    await place.deleteOne();
  } catch (err) {
    console.log("Something went wrong.", 500);
    const error = new HttpError(
      "Something went wrong. Unable to delete place.",
      500
    );
    return next(error);
  }
  return res.status(204).end();
};

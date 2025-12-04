// controllers/places-controllers.js
import HttpError from "../models/http-error.js";
import { getCoordinatesFromAddress } from "../util/location.js";
import Place from "../models/place.js";
import User from "../models/user.js";
import mongoose from "mongoose";
import fs from "fs";

// find id of the creator
export const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let placesWithUser;
  try {
    placesWithUser = await User.findById(userId).populate("places");
  } catch (err) {
    console.error("Something went wrong.", err);
    const error = new HttpError("Something went wrong. Place not found.", 500);
    return next(error);
  }

  if (placesWithUser.places.length === 0) {
    return next(new HttpError("No places found for the user id provided", 404));
  }

  return res.json({
    places: placesWithUser.places.map((place) =>
      place.toObject({ getters: true })
    ),
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
  console.log({ place: place.toObject({ getters: true }) });
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
        error.message || "Failed to retrieve coordinates for the given address",
        500
      )
    );
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image: req.file.path,
    creator,
  });

  // Use a transaction to keep Place and User documents in sync
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Persist the new place as part of the transaction
    await createdPlace.save({ session });

    // Load the creator within the same transactional session
    const user = await User.findById(creator).session(session);

    if (!user) {
      // Abort if the referenced user does not exist
      throw new HttpError("No user found with the provided id.", 404);
    }

    user.places.push(createdPlace._id);
    await user.save({ session });

    // Commit everything
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      place: createdPlace.toObject({ getters: true }),
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    if (err instanceof HttpError) {
      return next(err);
    }

    return next(new HttpError("Creating place failed. Please try again.", 500));
  }
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

// Delete a place and remove its reference from the creator's user document.
// Both operations must occur within a single transaction to maintain
// referential integrity: either both succeed, or both are rolled back.
export const deletePlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Load the place within the transactional session.
    // If the place does not exist, abort the operation.
    const place = await Place.findById(placeId).session(session);
    if (!place) {
      throw new HttpError("No place found with the provided id.", 404);
    }
    const imagePath = place.image;
    console.log(imagePath);
    // Load the creator and update their referenced places.
    // Ensures we do not leave an orphaned ObjectId reference behind.
    const user = await User.findById(place.creator).session(session);
    user.places = user.places.filter((p) => p.toString() !== placeId);
    await user.save({ session });

    // Delete the place document as part of the same atomic transaction.
    await place.deleteOne({ session });

    // Finalise all changes.
    await session.commitTransaction();
    session.endSession();
  } catch (err) {
    // Rollback the transaction and abort the session on any failure.
    await session.abortTransaction();
    session.endSession();

    if (err instanceof HttpError) {
      return next(err);
    }

    return next(new HttpError("Failed to delete place.", 500));
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });

  return res.status(204).end();
};

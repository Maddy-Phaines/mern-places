// routes/places-routes.js
import { Router } from "express";

import {
  getPlacesByUserId,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlaceById,
} from "../controllers/places-controllers.js";

import {
  createPlaceValidators,
  updatePlaceValidators,
  placeIdValidator,
  userIdValidator,
} from "../validators/place-validators.js";

import { validateRequest } from "../middleware/validate-request.js";
import { imageFileUpload } from "../middleware/file-upload.js";

const router = Router();

// GET
router.get("/user/:uid", userIdValidator, validateRequest, getPlacesByUserId);
router.get("/:pid", placeIdValidator, validateRequest, getPlaceById);

// CREATE
router.post(
  "/",
  imageFileUpload.single("image"),
  createPlaceValidators,
  validateRequest,
  createPlace
);

// UPDATE
router.patch(
  "/:pid",
  placeIdValidator,
  updatePlaceValidators,
  validateRequest,
  updatePlace
);

// DELETE
router.delete("/:pid", placeIdValidator, validateRequest, deletePlaceById);

export default router;

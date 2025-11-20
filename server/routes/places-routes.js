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
} from "../validators/place-validators.js";

import { validateRequest } from "../middleware/validate-request.js";

const router = Router();

// GET
router.get("/user/:uid", getPlacesByUserId);
router.get("/:pid", placeIdValidator, validateRequest, getPlaceById);

// CREATE
router.post("/", createPlaceValidators, validateRequest, createPlace);

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

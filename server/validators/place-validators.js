// validators/place-validators.js
import { body, param } from "express-validator";

// CREATE
export const createPlaceValidators = [
  body("title").trim().notEmpty().withMessage("A title is required."),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("A description is required."),
  body("address").trim().notEmpty().withMessage("An address is required."),
  body("creator").trim().notEmpty().withMessage("A creator is required."),
];

// UPDATE
export const updatePlaceValidators = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title cannot be empty."),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description cannot be empty."),
];

// DELETE / FIND by id
export const placeIdValidator = [
  param("pid")
    .trim()
    .isMongoId()
    .withMessage("pid must be a valid MongoDB ObjectId."),
];

export const userIdValidator = [
  param("uid")
    .trim()
    .isMongoId()
    .withMessage("uid must be a valid MongoDB ObjectId."),
];

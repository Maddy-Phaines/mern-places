// validators/user-validators.js
import { body, param } from "express-validator";

// REGISTER
export const createUserValidators = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("A valid email is required."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
];

// LOGIN (optional)
export const loginValidators = [
  body("email")
    .normalizeEmail()
    .isEmail()
    .withMessage("A valid email is required."),
  body("password").notEmpty().withMessage("Password is required."),
];

// USER ID PARAM
export const userIdValidator = [
  param("uid")
    .isMongoId()
    .withMessage("User ID must be a valid MongoDB ObjectId."),
];

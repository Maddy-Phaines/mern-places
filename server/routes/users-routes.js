import {
  getUsers,
  signUp,
  login,
  deleteUser,
} from "../controllers/users-controller.js";
import {
  createUserValidators,
  loginValidators,
  userIdValidator,
} from "../validators/user-validators.js";
import { validateRequest } from "../middleware/validate-request.js";
import { imageFileUpload } from "../middleware/file-upload.js";

import { Router } from "express";

// declare router
const router = Router();

// ----- User routes -----
// GET all users
router.get("/", getUsers);
// GET a single user
//router.get("/:uid", userIdValidator, validateRequest, getUserById);
// REGISTER
router.post(
  "/signup",
  imageFileUpload.single("image"),
  createUserValidators,
  validateRequest,
  signUp
);
// LOGIN
router.post("/login", loginValidators, validateRequest, login);
// DELETE
router.delete("/:uid", userIdValidator, validateRequest, deleteUser);

export default router;

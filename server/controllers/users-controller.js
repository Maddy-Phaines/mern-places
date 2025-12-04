import HttpError from "../models/http-error.js";
import User from "../models/user.js";
import Place from "../models/place.js";
import mongoose from "mongoose";

export const getUsers = async (_req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Could not get users. Please try again later",
      500
    );
    return next(error);
  }
  return res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

// link file to user in the database
export const signUp = async (req, res, next) => {
  let { name, email, password } = req.body;
  /*
  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return next(new HttpError("All inputs must be strings.", 422));
  }

  name = name.trim();
  email = email.trim().toLowerCase();
  password = password.trim();
  places = places.trim();

  // check fields are completed
  if (!name || !email || !password || !places) {
    return next(new HttpError("All fields must be completed", 422));
  }
*/
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("Signup failed. Please try again later", 500);
    return next(error);
  }
  if (existingUser) {
    return next(
      new HttpError("User already exists. Please login instead", 422)
    );
  }
  const newUser = new User({
    name,
    email,
    image: req.file.path,
    password,
    places: [],
  });

  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("Signing up failed. Please try again.", 500);
    return next(error);
  }

  const safeUser = newUser.toObject({ getters: true });
  delete safeUser.password;

  res.status(201).json({ user: safeUser });
};

export const login = async (req, res, next) => {
  // Debug: log incoming request body and headers to help trace validation issues
  console.log("login req.body:", req.body);
  console.log("login req.headers:", req.headers);

  let { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return next(new HttpError("Email and password must be provided.", 422));
  }
  email = email.trim().toLowerCase();
  password = password.trim();

  let user;

  try {
    user = await User.findOne({ email });
  } catch (err) {
    return next(
      new HttpError("Something went wrong. Please try again later.", 500)
    );
  }

  if (!user || user.password !== password) {
    return next(
      new HttpError("Could not login. Incorrect credentials provided.", 401)
    );
  }

  const safeUser = user.toObject({ getters: true });
  delete safeUser.password;

  return res.status(200).json({ message: "Login successful", user: safeUser });
};

export const deleteUser = async (res, req, next) => {
  const userId = req.params.uid;

  let user;

  try {
    user = await User.findById(userId);
  } catch (err) {
    console.error("Something went wrong. Unable to delte user.");
    const error = new HttpError(
      "Something went wrong. Could not delete user.",
      500
    );
    return next(error);
  }

  if (!user) {
    return next(new HttpError("No user found with the provided user id.", 404));
  }

  try {
    await user.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong. Could not delete user.",
      500
    );
    return next(error);
  }

  res.status(204).json({ message: "Deleted place." });
};

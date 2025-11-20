import HttpError from "../models/http-error.js";
import User from "../models/user.js";

import { v4 as uuidv4 } from "uuid";

const DUMMY_USERS = [
  {
    id: "u1",
    name: "Maddy Haines",
    email: "test@test.com",
    password: "testers",
  },
  {
    id: "u2",
    name: "Jenny Mayne",
    email: "test2@test.com",
    password: "testers2",
  },
];

export const getUsers = (req, res, next) => {
  const safeUsers = DUMMY_USERS.map(({ password, ...u }) => u);
  return res.json({ users: safeUsers });
};

export const signUp = (req, res, next) => {
  let { name, email, password } = req.body;

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

  // check fields are completed
  if (!name || !email || !password) {
    return next(new HttpError("All fields must be completed", 422));
  }

  const hasAccount = DUMMY_USERS.some((u) => u.email.toLowerCase() === email);
  if (hasAccount) {
    return next(
      new HttpError(
        "Could not sign up. A user with that email already exists.",
        409
      )
    );
  }
  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(newUser);

  const { password: _omit, ...safeUser } = newUser;

  return res.status(201).json({ message: "Account created", user: safeUser });
};

export const login = (req, res, next) => {
  let { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return next(new HttpError("Email and password must be provided.", 422));
  }
  email = email.trim().toLowerCase();
  password = password.trim();

  const user = DUMMY_USERS.find((u) => u.email.toLowerCase() === email);
  if (!user || user.password !== password) {
    return next(
      new HttpError("Could not login. Incorrect credentials provided.", 401)
    );
  }

  const { password: _omit, ...safeUser } = user;

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

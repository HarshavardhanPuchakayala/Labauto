import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

import {
  createUser,
  findUserByEmail,
} from "../repositories/user.repository.js";

export const registerUser = async (data) => {
  const safeData = {
    name: data.name,
    email: data.email,
    password: data.password,
    role: "technician",
    labId: data.labId,
  };

  try {
    const user = await createUser(safeData);

    const userResponse = user.toObject();
    delete userResponse.password;

    return userResponse;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Email already registered", 409);
    }

    throw error;
  }
};

export const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      labId: user.labId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const userResponse = user.toObject();
  delete userResponse.password;

  return {
    token,
    user: userResponse,
  };
};
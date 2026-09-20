import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import { generateSequenceId } from "../utils/generateSequenceId.js";

import { createUser, findUserByEmail } from "../repositories/user.repository.js";
import Lab from "../models/lab.model.js";
import User from "../models/user.model.js";

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
    { userId: user._id, role: user.role, labId: user.labId },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  const userResponse = user.toObject();
  delete userResponse.password;

  return { token, user: userResponse };
};

export const registerLabWithTechnician = async (data) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const labId = await generateSequenceId("labId", "LAB", session);

    const trialExpiry = new Date();
    trialExpiry.setDate(trialExpiry.getDate() + 14); // 14-day trial

    const [lab] = await Lab.create(
      [
        {
          labId,
          name: data.labName,
          phone: data.labPhone,
          email: data.labEmail,
          address: data.labAddress,
          subscriptionStatus: "trial",
          subscriptionExpiresAt: trialExpiry,
        },
      ],
      { session }
    );

    let user;
    try {
      [user] = await User.create(
        [
          {
            name: data.technicianName,
            email: data.technicianEmail,
            password: data.technicianPassword,
            role: "technician",
            labId: lab._id,
          },
        ],
        { session }
      );
    } catch (error) {
      if (error.code === 11000) {
        throw new AppError("This email is already registered", 409);
      }
      throw error;
    }

    await session.commitTransaction();
    session.endSession();

    const token = jwt.sign(
      { userId: user._id, role: user.role, labId: user.labId },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    return { token, user: userResponse, lab };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
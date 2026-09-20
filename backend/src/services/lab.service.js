import AppError from "../utils/AppError.js";
import { generateSequenceId } from "../utils/generateSequenceId.js";
import {
  createLab,
  findLabById,
  updateLab,
  setLabLogo,
} from "../repositories/lab.repository.js";

export const registerLab = async (data) => {
  const labId = await generateSequenceId("labId", "LAB");

  const labData = {
    ...data,
    labId,
  };

  try {
    return await createLab(labData);
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Lab already exists", 409);
    }
    throw error;
  }
};

export const renewSubscription = async (labId, newExpiryDate) => {
  const lab = await findLabById(labId);
  if (!lab) {
    throw new AppError("Lab not found", 404);
  }

  return await updateLab(labId, {
    subscriptionExpiresAt: newExpiryDate,
    subscriptionStatus: "active",
  });
};

export const getMyLab = async (labId) => {
  const lab = await findLabById(labId);
  if (!lab) {
    throw new AppError("Lab not found", 404);
  }
  return lab;
};

export const updateMyLab = async (labId, data) => {
  // Whitelist — never let subscriptionStatus/subscriptionExpiresAt slip in from a technician's request
  const allowedFields = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    tagline: data.tagline,
  };

  const lab = await updateLab(labId, allowedFields);
  if (!lab) {
    throw new AppError("Lab not found", 404);
  }
  return lab;
};

export const uploadMyLabLogo = async (labId, file) => {
  if (!file) {
    throw new AppError("No logo file provided", 400);
  }
  if (!["image/png", "image/jpeg"].includes(file.mimetype)) {
    throw new AppError("Logo must be PNG or JPEG", 400);
  }

  const lab = await setLabLogo(labId, {
    data: file.buffer,
    contentType: file.mimetype,
  });

  if (!lab) {
    throw new AppError("Lab not found", 404);
  }

  return lab;
};
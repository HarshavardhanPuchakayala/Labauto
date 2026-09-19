import AppError from "../utils/AppError.js";
import { generateSequenceId } from "../utils/generateSequenceId.js";
import { createLab,findLabById,updateLab } from "../repositories/lab.repository.js";

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

export const renewSubscription = async (
  labId,
  newExpiryDate
) => {
  const lab = await findLabById(labId);

  if (!lab) {
    throw new AppError("Lab not found", 404);
  }

  return await updateLab(labId, {
    subscriptionExpiresAt: newExpiryDate,
    subscriptionStatus: "active",
  });
};

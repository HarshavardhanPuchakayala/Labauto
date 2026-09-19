import AppError from "../utils/AppError.js";
import { generateSequenceId } from "../utils/generateSequenceId.js";
import { createLab } from "../repositories/lab.repository.js";

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
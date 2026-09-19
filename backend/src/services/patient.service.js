import AppError from "../utils/AppError.js";
import { generateSequenceId } from "../utils/generateSequenceId.js";
import { createPatient, findPatientsByLab } from "../repositories/patient.repository.js";

export const registerPatient = async (data, labId) => {
  const patientId = await generateSequenceId("patientId", "PAT");
  const patientData = { ...data, labId, patientId };

  try {
    return await createPatient(patientData);
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("Patient ID already exists, please try again", 409);
    }
    throw error;
  }
};

export const getPatientsForLab = async (labId) => {
  return await findPatientsByLab(labId);
};
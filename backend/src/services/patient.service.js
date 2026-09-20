import AppError from "../utils/AppError.js";
import { generateSequenceId } from "../utils/generateSequenceId.js";
import { createPatient, findPatientsByLab, findPatientById, updatePatient } from "../repositories/patient.repository.js";

export const registerPatient = async (data, labId) => {
  const patientId = await generateSequenceId(`patientId:${labId}`, "PAT");
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

export const getPatientById = async (patientId, labId) => {
  const patient = await findPatientById(patientId);
  if (!patient) {
    throw new AppError("Patient not found", 404);
  }
  if (patient.labId.toString() !== labId.toString()) {
    throw new AppError("Patient does not belong to your lab", 403);
  }
  return patient;
};

export const updatePatientForLab = async (patientId, labId, data) => {
  const patient = await findPatientById(patientId);
  if (!patient) {
    throw new AppError("Patient not found", 404);
  }
  if (patient.labId.toString() !== labId.toString()) {
    throw new AppError("Patient does not belong to your lab", 403);
  }

  // Whitelist — never allow labId or patientId to be changed via this route
  const allowedFields = {
    name: data.name,
    dob: data.dob,
    gender: data.gender,
    phone: data.phone,
    email: data.email,
    address: data.address,
  };

  return await updatePatient(patientId, allowedFields);
};
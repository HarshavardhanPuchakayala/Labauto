import AppError from "../utils/AppError.js";
import { findPatientById } from "../repositories/patient.repository.js";
import { createInsurance, findInsurancesByPatient } from "../repositories/insurance.repository.js";

export const addInsurance = async (data, labId) => {
  const patient = await findPatientById(data.patient);
  if (!patient) {
    throw new AppError("Patient not found", 404);
  }
  if (patient.labId.toString() !== labId.toString()) {
    throw new AppError("Patient does not belong to your lab", 403);
  }

  const insuranceData = { ...data, labId };
  return await createInsurance(insuranceData);
};

export const getInsurancesForPatient = async (patientId, labId) => {
  const patient = await findPatientById(patientId);
  if (!patient) {
    throw new AppError("Patient not found", 404);
  }
  if (patient.labId.toString() !== labId.toString()) {
    throw new AppError("Patient does not belong to your lab", 403);
  }

  return await findInsurancesByPatient(patientId);
};
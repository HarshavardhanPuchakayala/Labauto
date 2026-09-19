import Patient from "../models/patient.model.js";

export const createPatient = async (data) => {
  return await Patient.create(data);
};

export const findPatientsByLab = async (labId) => {
  return await Patient.find({ labId });
};

export const findPatientById = async (id) => {
  return await Patient.findById(id);
};
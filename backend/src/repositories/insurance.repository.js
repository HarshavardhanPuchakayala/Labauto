import Insurance from "../models/insurance.model.js";

export const createInsurance = async (data) => {
  return await Insurance.create(data);
};

export const findInsurancesByPatient = async (patientId) => {
  return await Insurance.find({ patient: patientId });
};
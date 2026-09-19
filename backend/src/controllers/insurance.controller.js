import { addInsurance, getInsurancesForPatient } from "../services/insurance.service.js";

export const addInsuranceHandler = async (req, res, next) => {
  try {
    const insurance = await addInsurance(req.body, req.user.labId);
    res.status(201).json({ message: "Insurance added successfully", insurance });
  } catch (error) {
    next(error);
  }
};

export const getInsurancesHandler = async (req, res, next) => {
  try {
    const insurances = await getInsurancesForPatient(req.params.patientId, req.user.labId);
    res.status(200).json({ insurances });
  } catch (error) {
    next(error);
  }
};
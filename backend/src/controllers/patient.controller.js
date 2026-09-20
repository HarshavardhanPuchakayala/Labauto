import { registerPatient, getPatientsForLab, getPatientById } from "../services/patient.service.js";

export const createPatientHandler = async (req, res, next) => {
  try {
    const patient = await registerPatient(req.body, req.user.labId);
    res.status(201).json({ message: "Patient created successfully", patient });
  } catch (error) {
    next(error);
  }
};

export const getPatientsHandler = async (req, res, next) => {
  try {
    const patients = await getPatientsForLab(req.user.labId);
    res.status(200).json({ patients });
  } catch (error) {
    next(error);
  }
};

export const getPatientByIdHandler = async (req, res, next) => {
  try {
    const patient = await getPatientById(req.params.id, req.user.labId);
    res.status(200).json({ patient });
  } catch (error) {
    next(error);
  }
};

export const updatePatientHandler = async (req, res, next) => {
  try {
    const patient = await updatePatientForLab(req.params.id, req.user.labId, req.body);
    res.status(200).json({ message: "Patient updated successfully", patient });
  } catch (error) {
    next(error);
  }
};
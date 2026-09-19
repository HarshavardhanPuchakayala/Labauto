import Lab from "../models/lab.model.js";

export const createLab = async (data) => {
  return await Lab.create(data);
};
export const findAllLabs = async () => {
  return await Lab.find({});
};

export const findLabById = async (id) => {
  return await Lab.findById(id);
};
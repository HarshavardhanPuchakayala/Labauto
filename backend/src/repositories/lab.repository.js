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

export const updateLab = async (id, updateData) => {
  return await Lab.findByIdAndUpdate(
    id,
    updateData,
    { returnDocument: "after" }
  );
};
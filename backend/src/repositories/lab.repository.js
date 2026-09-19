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

// Only the PDF generation path should use this one
export const findLabWithLogoById = async (id) => {
  return await Lab.findById(id).select("+logo");
};

export const updateLab = async (id, updateData) => {
  return await Lab.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
};

export const setLabLogo = async (id, logo) => {
  // The returned document excludes `logo` because of select: false
  return await Lab.findByIdAndUpdate(
    id,
    { logo, hasLogo: true },
    { returnDocument: "after", runValidators: true }
  );
};
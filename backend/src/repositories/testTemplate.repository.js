import TestTemplate from "../models/testTemplate.model.js";

export const createTemplate = async (data) => {
  return await TestTemplate.create(data);
};

export const findTemplatesByLab = async (labId) => {
  return await TestTemplate.find({ labId });
};

export const findTemplateById = async (id) => {
  return await TestTemplate.findById(id);
};

export const updateTemplate = async (id, updateData) => {
  return await TestTemplate.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
};
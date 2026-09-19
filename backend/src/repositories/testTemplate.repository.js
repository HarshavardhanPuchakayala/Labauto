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
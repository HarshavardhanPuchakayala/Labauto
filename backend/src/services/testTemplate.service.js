import AppError from "../utils/AppError.js";

import {
  createTemplate,
  findTemplatesByLab,
} from "../repositories/testTemplate.repository.js";

export const registerTemplate = async (
  data,
  labId,
  userId
) => {
  const templateData = {
    ...data,
    labId,
    createdBy: userId,
  };

  try {
    return await createTemplate(templateData);
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError(
        "A template with this name already exists for your lab",
        409
      );
    }

    throw error;
  }
};

export const getTemplatesForLab = async (labId) => {
  return await findTemplatesByLab(labId);
};
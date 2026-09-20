import AppError from "../utils/AppError.js";
import { createTemplate, findTemplatesByLab, findTemplateById, updateTemplate } from "../repositories/testTemplate.repository.js";
import { defaultTemplates } from "../utils/defaultTemplates.js";

export const registerTemplate = async (data, labId, userId) => {
  const templateData = { ...data, labId, createdBy: userId };

  try {
    return await createTemplate(templateData);
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("A template with this name already exists for your lab", 409);
    }
    throw error;
  }
};

export const getTemplatesForLab = async (labId) => {
  return await findTemplatesByLab(labId);
};

export const seedDefaultTemplates = async (labId, userId) => {
  const existing = await findTemplatesByLab(labId);
  const existingNames = new Set(existing.map((t) => t.name));

  const toCreate = defaultTemplates.filter((t) => !existingNames.has(t.name));

  const created = [];
  for (const template of toCreate) {
    try {
      const doc = await createTemplate({ ...template, labId, createdBy: userId });
      created.push(doc);
    } catch (error) {
      // Skip duplicates silently (race condition safety), continue with the rest
      if (error.code !== 11000) throw error;
    }
  }

  return { createdCount: created.length, skippedCount: defaultTemplates.length - toCreate.length };
};

export const updateTemplateForLab = async (templateId, labId, data) => {
  const template = await findTemplateById(templateId);
  if (!template) {
    throw new AppError("Template not found", 404);
  }
  if (template.labId.toString() !== labId.toString()) {
    throw new AppError("Template does not belong to your lab", 403);
  }

  try {
    return await updateTemplate(templateId, { name: data.name, fields: data.fields });
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError("A template with this name already exists for your lab", 409);
    }
    throw error;
  }
};
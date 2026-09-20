import { registerTemplate, getTemplatesForLab, seedDefaultTemplates, updateTemplateForLab } from "../services/testTemplate.service.js";

export const createTemplateHandler = async (req, res, next) => {
  try {
    const template = await registerTemplate(req.body, req.user.labId, req.user.userId);
    res.status(201).json({ message: "Test template created successfully", template });
  } catch (error) {
    next(error);
  }
};

export const getTemplatesHandler = async (req, res, next) => {
  try {
    const templates = await getTemplatesForLab(req.user.labId);
    res.status(200).json({ templates });
  } catch (error) {
    next(error);
  }
};

export const seedDefaultTemplatesHandler = async (req, res, next) => {
  try {
    const result = await seedDefaultTemplates(req.user.labId, req.user.userId);
    res.status(200).json({
      message: `${result.createdCount} standard templates added (${result.skippedCount} already existed).`,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTemplateHandler = async (req, res, next) => {
  try {
    const template = await updateTemplateForLab(req.params.id, req.user.labId, req.body);
    res.status(200).json({ message: "Template updated successfully", template });
  } catch (error) {
    next(error);
  }
};
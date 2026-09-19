import {
  registerTemplate,
  getTemplatesForLab,
} from "../services/testTemplate.service.js";

export const createTemplateHandler = async (
  req,
  res,
  next
) => {
  try {
    const template = await registerTemplate(
      req.body,
      req.user.labId,
      req.user.userId
    );

    res.status(201).json({
      message: "Test template created successfully",
      template,
    });
  } catch (error) {
    next(error);
  }
};

export const getTemplatesHandler = async (
  req,
  res,
  next
) => {
  try {
    const templates = await getTemplatesForLab(
      req.user.labId
    );

    res.status(200).json({
      templates,
    });
  } catch (error) {
    next(error);
  }
};
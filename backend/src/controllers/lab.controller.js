import {
  registerLab,
} from "../services/lab.service.js";

export const createLabHandler = async (req, res, next) => {
  try {
    const lab = await registerLab(req.body);

    res.status(201).json({
      message: "Lab created successfully",
      lab,
    });
  } catch (error) {
    next(error);
  }
};
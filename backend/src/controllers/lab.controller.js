import {
  registerLab,
  renewSubscription
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
export const renewLabHandler = async (req, res, next) => {
  try {
    const lab = await renewSubscription(
      req.params.id,
      req.body.subscriptionExpiresAt
    );

    res.status(200).json({
      message: "Subscription renewed successfully",
      lab,
    });
  } catch (error) {
    next(error);
  }
};
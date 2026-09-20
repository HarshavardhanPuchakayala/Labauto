import multer from "multer";
import {
  registerLab,
  renewSubscription,
  getMyLab,
  updateMyLab,
  uploadMyLabLogo,
} from "../services/lab.service.js";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export const createLabHandler = async (req, res, next) => {
  try {
    const lab = await registerLab(req.body);
    res.status(201).json({ message: "Lab created successfully", lab });
  } catch (error) {
    next(error);
  }
};

export const renewLabHandler = async (req, res, next) => {
  try {
    const lab = await renewSubscription(req.params.id, req.body.subscriptionExpiresAt);
    res.status(200).json({ message: "Subscription renewed successfully", lab });
  } catch (error) {
    next(error);
  }
};

export const getMyLabHandler = async (req, res, next) => {
  try {
    const lab = await getMyLab(req.user.labId);
    res.status(200).json({ lab });
  } catch (error) {
    next(error);
  }
};

export const updateMyLabHandler = async (req, res, next) => {
  try {
    const lab = await updateMyLab(req.user.labId, req.body);
    res.status(200).json({ message: "Lab profile updated successfully", lab });
  } catch (error) {
    next(error);
  }
};

export const uploadMyLabLogoHandler = async (req, res, next) => {
  try {
    const lab = await uploadMyLabLogo(req.user.labId, req.file);
    res.status(200).json({ message: "Logo uploaded successfully", hasLogo: lab.hasLogo });
  } catch (error) {
    next(error);
  }
};
import AppError from "../utils/AppError.js";

import {
  findAllLabs,
  findLabById,
} from "../repositories/lab.repository.js";

import {
  countTechniciansByLab,
} from "../repositories/user.repository.js";

export const getAllLabsOverview = async () => {
  const labs = await findAllLabs();

  const now = new Date();
  const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

  const enrichedLabs = await Promise.all(
    labs.map(async (lab) => {
      const technicianCount = await countTechniciansByLab(lab._id);

      const timeUntilExpiry =
        new Date(lab.subscriptionExpiresAt).getTime() -
        now.getTime();

      const isExpiringSoon =
        timeUntilExpiry > 0 &&
        timeUntilExpiry <= sevenDaysInMs;

      return {
        ...lab.toObject(),
        technicianCount,
        isExpiringSoon,
      };
    })
  );

  return enrichedLabs;
};

export const getLabDetail = async (labId) => {
  const lab = await findLabById(labId);

  if (!lab) {
    throw new AppError("Lab not found", 404);
  }

  const technicianCount = await countTechniciansByLab(labId);

  return {
    ...lab.toObject(),
    technicianCount,
  };
};
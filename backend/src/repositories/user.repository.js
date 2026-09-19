import User from "../models/user.model.js";

export const createUser = async (data) => {
  return await User.create(data);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const countTechniciansByLab = async (labId) => {
  return await User.countDocuments({
    labId,
    role: "technician",
  });
};
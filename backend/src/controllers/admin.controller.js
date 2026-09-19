import {
  getAllLabsOverview,
  getLabDetail,
} from "../services/admin.service.js";

export const getAllLabsHandler = async (
  req,
  res,
  next
) => {
  try {
    const labs = await getAllLabsOverview();

    res.status(200).json({
      labs,
    });
  } catch (error) {
    next(error);
  }
};

export const getLabDetailHandler = async (
  req,
  res,
  next
) => {
  try {
    const lab = await getLabDetail(req.params.id);

    res.status(200).json({
      lab,
    });
  } catch (error) {
    next(error);
  }
};
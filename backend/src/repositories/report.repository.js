import Report from "../models/report.model.js";

export const createReport = async (data) => {
  const report = await Report.create(data);
  return await Report.findById(report._id)
    .populate("patient", "name patientId")
    .populate("testTemplate", "name fields")
    .populate("technician", "name");
};

export const findReportsByLab = async (labId) => {
  return await Report.find({ labId })
    .populate("patient", "name patientId")
    .populate("testTemplate", "name fields")
    .populate("technician", "name");
};

export const findReportById = async (id) => {
  return await Report.findById(id)
    .populate("patient", "name patientId")
    .populate("testTemplate")
    .populate("technician", "name");
};

export const findReportsByVisit = async (visitId) => {
  return await Report.find({ visitId })
    .populate("patient", "name patientId")
    .populate("testTemplate")
    .populate("technician", "name");
};

export const updateReport = async (id, updateData) => {
  return await Report.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
  });
};
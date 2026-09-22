import jwt from "jsonwebtoken";

export const generateReportAccessToken = (reportId) => {
  return jwt.sign({ reportId, scope: "report-pdf" }, process.env.JWT_SECRET, { expiresIn: "365d" });
};

export const verifyReportAccessToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded.scope !== "report-pdf") {
    throw new Error("Invalid token scope");
  }
  return decoded.reportId;
};
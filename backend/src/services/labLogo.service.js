import AppError from "../utils/AppError.js";
import { setLabLogo } from "../repositories/lab.repository.js";

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff]);

const startsWith = (buffer, signature) =>
  buffer.length >= signature.length &&
  buffer.subarray(0, signature.length).equals(signature);

const getVerifiedContentType = (buffer) => {
  if (startsWith(buffer, PNG_SIGNATURE)) return "image/png";
  if (startsWith(buffer, JPEG_SIGNATURE)) return "image/jpeg";
  return null;
};

export const uploadLabLogo = async (labId, file) => {
  if (!file || !file.buffer || file.buffer.length === 0) {
    throw new AppError("Logo file is required", 400);
  }

  // Trust the bytes, not the client's mimetype
  const contentType = getVerifiedContentType(file.buffer);

  if (!contentType) {
    throw new AppError("Logo must be a valid PNG or JPEG image", 400);
  }

  const lab = await setLabLogo(labId, {
    data: file.buffer,
    contentType,
  });

  if (!lab) {
    throw new AppError("Lab not found", 404);
  }

  // Never return the bytes
  return {
    message: "Lab logo uploaded successfully",
    hasLogo: true,
  };
};
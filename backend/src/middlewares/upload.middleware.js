import multer from "multer";
import AppError from "../utils/AppError.js";

const MAX_LOGO_SIZE = 200 * 1024; // 200 KB
const ALLOWED_MIME_TYPES = new Set(["image/png", "image/jpeg"]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_LOGO_SIZE,
    files: 1,
  },
  // The MIME type is client-supplied, so this is only a first filter.
  // The real check is the magic-byte verification in the service.
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      return cb(new AppError("Only PNG and JPEG logo files are allowed", 400));
    }
    cb(null, true);
  },
});

export const uploadLogo = (req, res, next) => {
  upload.single("logo")(req, res, (err) => {
    if (!err) {
      return next();
    }

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return next(new AppError("Logo must be under 200 KB", 400));
      }

      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(new AppError('Send the file in a field named "logo"', 400));
      }

      return next(new AppError(`Logo upload failed: ${err.message}`, 400));
    }

    // AppError from fileFilter, or anything unexpected
    return next(err);
  });
};
import QRCode from "qrcode";

export const generateQrCodeBuffer = async (url) => {
  try {
    return await QRCode.toBuffer(url, { margin: 1, scale: 5 });
  } catch (error) {
    console.error("Failed to generate QR code:", error.message);
    return null;
  }
};
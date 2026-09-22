import bwipjs from "bwip-js";

export const generateBarcodeBuffer = async (text) => {
  try {
    return await bwipjs.toBuffer({
      bcid: "code128",
      text,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: "center",
    });
  } catch (error) {
    console.error("Failed to generate barcode:", error.message);
    return null;
  }
};
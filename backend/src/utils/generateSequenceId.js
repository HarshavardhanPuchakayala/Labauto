import Counter from "../models/counter.model.js";

export const generateSequenceId = async (key, prefix) => {
  const counter = await Counter.findByIdAndUpdate(
    key,
    { $inc: { sequence: 1 } },
    {
      returnDocument: "after",
      upsert: true,
    }
  );

  return `${prefix}-${String(counter.sequence).padStart(6, "0")}`;
};
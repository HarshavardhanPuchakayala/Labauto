import Counter from "../models/counter.model.js";

export const generateSequenceId = async (key, prefix, session) => {
  const counter = await Counter.findByIdAndUpdate(
    key,
    { $inc: { sequence: 1 } },
    { returnDocument: "after", upsert: true, session }
  );

  return `${prefix}-${String(counter.sequence).padStart(6, "0")}`;
};
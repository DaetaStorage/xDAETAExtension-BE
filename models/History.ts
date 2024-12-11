import mongoose from "mongoose";

const Schema = mongoose.Schema;

const historySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  items: {
    type: Number,
    required: true,
  },
  reward: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const History = mongoose.model("histories", historySchema);

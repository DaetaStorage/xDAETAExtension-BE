import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  wallet: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    default: 0,
  },
  items: {
    type: Number,
    default: 0,
  },
  refCode: {
    type: String,
    required: false,
  },
  isSkipped: {
    type: Boolean,
    default: false,
  },
  isOtp: {
    type: Boolean,
    default: false,
  },
  code: {
    type: String,
    required: true,
  },
  rewards: {
    type: Number,
    default: 0,
  },
  tweets: [
    {
      id: {
        type: String,
        required: true,
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model("users", userSchema);

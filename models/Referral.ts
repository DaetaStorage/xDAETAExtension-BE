import mongoose from "mongoose";
import { referralOtRewards } from "../config/referral";

const Schema = mongoose.Schema;

const referralSchema = new Schema({
  inviter: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  invitee: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  reward: {
    type: Number,
    default: referralOtRewards,
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

export const Referral = mongoose.model("referrals", referralSchema);

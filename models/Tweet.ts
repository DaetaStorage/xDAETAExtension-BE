import mongoose from "mongoose";

const Schema = mongoose.Schema;

const tweetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  tweet_id: {
    type: String,
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

export const Tweet = mongoose.model("tweets", tweetSchema);

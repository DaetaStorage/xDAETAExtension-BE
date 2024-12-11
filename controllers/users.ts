import { Request, Response } from "express";
import rs from "randomstring";

import { User } from "../models/User";
import { History } from "../models/History";
import { Referral } from "../models/Referral";
import { Tweet } from "../models/Tweet";

import { referralRatePerClaim } from "../config/referral";
import { pointsForOneTimeClaim } from "../config/point";

// Login or Register User
export const registerUser = async (req: Request, res: any) => {
  const wallet = req.body.wallet;

  if (!wallet)
    return res.status(400).json({ msg: "Bad request: Wallet was not sent" });

  const invite_code = rs.generate(8);

  try {
    const user = await User.findOne({ wallet });

    if (user) {
      // User already exists
      const histories = await History.find({ user: user._id });
      const referrals = await Referral.find({ inviter: user._id });

      const userInfo = {
        ...user,
        histories,
        referrals,
      };

      return res.status(200).json(userInfo);
    } else {
      // Create a new user
      const user = await User.create({
        wallet,
        code: invite_code,
      });

      const userInfo = {
        ...user,
        histories: null,
        referrals: null,
      };

      return res.status(200).json(userInfo);
    }
  } catch (error) {
    console.error("Error in user registration: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// Verify referral user by referral code
export const verifyReferralCode = async (req: Request, res: any) => {
  const { wallet, refCode, isSkipped } = req.body;

  if (!wallet)
    return res
      .status(400)
      .json({ msg: "Bad request: Wallet address was not sent" });

  try {
    const user = await User.findOne({ wallet });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.code == refCode)
      return res.status(400).json({ msg: "Invalid referral code" });

    if (isSkipped) {
      // No referral user
      user.isSkipped = true;
      await user.save();

      return res.status(200).json(user);
    } else {
      // Referral user
      const refUser = await User.findOne({ code: refCode });

      if (!refUser)
        return res.status(404).json({ msg: "Referral code is incorrect" });

      user.refCode = refCode;
      await user.save();

      return res.status(200).json(user);
    }
  } catch (error) {
    console.error("Error in verifying referral code: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// Save Earning History and Tweets
export const saveEarningHistory = async (req: Request, res: any) => {
  const { wallet, items, reward, tweets } = req.body;

  if (!wallet || !items || !reward || !tweets)
    return res.status(400).json({ msg: "Bad request: data is missing" });

  try {
    const user = await User.findOne({ wallet });
    if (!user) return res.status(404).json({ msg: "User not found" });

    let twt_cnt = 0;
    if (tweets.length > 0) {
      await Promise.all(
        tweets.map(async (item: any) => {
          const temp = await Tweet.findOne({ tweet_id: item.id });
          if (!temp) {
            user.tweets.push({
              id: item.id,
              text: item.text,
            });

            await Tweet.create({
              user: user._id,
              tweet_id: item.id,
            });

            twt_cnt++;
          }
        })
      );
    }

    user.rewards += twt_cnt;
    user.points += twt_cnt;
    user.items += twt_cnt;

    await History.create({
      user: user._id,
      items: twt_cnt,
      reward: twt_cnt,
    });

    await user.save();

    const inviter = await User.findOne({ code: user.refCode });
    if (inviter) {
      // Give bonus to inviter of current user
      inviter.points += twt_cnt * referralRatePerClaim;
      await inviter.save();

      await Referral.create({
        inviter: inviter._id,
        invitee: user._id,
        reward: twt_cnt * referralRatePerClaim,
      });
    }

    return res.status(200).json({ count: twt_cnt });
  } catch (error) {
    console.error(
      "Error in saving earning history and giving referrer bonus: ",
      error
    );
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// Claim Points; Before sending tx, calculate points to claim (ex. 25%)
export const claimPoints = async (req: Request, res: any) => {
  const { wallet } = req.body;
  if (!wallet)
    return res.status(400).json({ msg: "Bad request: Wallet was not sent" });

  try {
    const user = await User.findOne({ wallet });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.points == 0)
      return res.status(400).json({ msg: "Bad request: No points to claim" });

    const pointsToClaim = (user.points * pointsForOneTimeClaim).toFixed(0);

    return res.status(200).json({ count: Number(pointsToClaim) });
  } catch (error) {
    console.error("Error in claiming points: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// Update Points Balance after Claim
export const claimedPoints = async (req: Request, res: any) => {
  const { wallet, points } = req.body;
  if (!wallet || !points)
    return res.status(400).json({ msg: "Bad request: Wallet was not sent" });

  try {
    const user = await User.findOne({ wallet });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.points == 0)
      return res.status(400).json({ msg: "Bad request: No points to claim" });

    if (points > user.points) user.points = 0;
    else user.points -= Number(points);

    await user.save();

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in updating points after a claim: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

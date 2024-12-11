import { Request, Response } from "express";

import { User } from "../models/User";
import { getTweetsByUserId, getUserByUsername } from "../modules/xHandler";

export const getXTweetsByUser = async (req: Request, res: any) => {
  const { wallet, handle } = req.body;
  if (!wallet || !handle)
    return res
      .status(400)
      .json({ msg: "Bad request: Wallet or X handle was not sent" });

  try {
    const user = await User.findOne({ wallet });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const xId = await getUserByUsername(handle);
    if (!xId) return res.status(500).json({ msg: "Internal server error" });

    const tweets = await getTweetsByUserId(xId); // TO DO: May need to update object interface to extension data entry
    return res.status(200).json(tweets);
  } catch (error) {
    console.error("Error in getting X tweets by user id: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

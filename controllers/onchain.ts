import { Request, Response } from "express";
import { Wallet } from "ethers";

import { User } from "../models/User";

// Generate Signature to collect tokens from the SC
export const generateSignature = async (req: Request, res: any) => {
  const { wallet, points } = req.body;
  if (!wallet || !points)
    return res.status(400).json({ msg: "Bad request: Wallet was not sent" });

  try {
    const user = await User.findOne({ wallet });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (user.points === 0 || user.points < points)
      return res.status(400).json({ msg: "Not enough tokens to claim" });

    const domain = {
      name: "xExtension",
      version: "1",
      verifyingContract: process.env.EXT_SC,
      chainId: 11155111,
      // chainId: 1,
    };

    const types = {
      ExtensionClientData: [
        { name: "client", type: "address" },
        { name: "points", type: "uint256" },
        { name: "server", type: "address" },
      ],
    };

    const requestData = {
      client: wallet,
      points: Number(points),
      server: process.env.EXT_SC,
    };

    const signer = new Wallet(process.env.EXT_OWNER as string);
    const signature = await signer.signTypedData(domain, types, requestData);

    return res.status(200).json({ sig: { ...requestData, signature } });
  } catch (error) {
    console.error("Error in generating signature: ", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

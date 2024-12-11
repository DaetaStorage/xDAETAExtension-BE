import express from "express";

import {
  claimedPoints,
  claimPoints,
  registerUser,
  saveEarningHistory,
  verifyReferralCode,
} from "../controllers/users";

const router = express.Router();

router.post("/", registerUser);
router.post("/verify-referral", verifyReferralCode);
router.post("/save-earning", saveEarningHistory);
router.post("/claim-points", claimPoints);
router.post("/points-claimed", claimedPoints);

export default router;

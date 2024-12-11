import express from "express";

import { getXTweetsByUser } from "../controllers/x";

const router = express.Router();

router.post("/", getXTweetsByUser);

export default router;

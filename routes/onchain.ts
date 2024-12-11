import express from "express";

import { generateSignature } from "../controllers/onchain";

const router = express.Router();

router.post("/", generateSignature);

export default router;

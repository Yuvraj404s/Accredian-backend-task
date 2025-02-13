import express from "express";
import { submitReferral } from "../controllers/referralController.js";

const router = express.Router();

router.post("/submit", submitReferral);

export default router;

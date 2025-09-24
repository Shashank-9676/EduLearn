import express from "express";
import { getEnrollmentOptions } from "../controllers/OptionsController.js";

const router = express.Router();

// GET API for enrollment options (dynamic from DB)
router.get("/enrollment-options", getEnrollmentOptions);
export default router;

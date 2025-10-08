import express from "express";
import { getEnrollmentOptions, getOrganizationOptions } from "../controllers/OptionsController.js";
import { authMiddleware, rbacMiddleware } from "../middlewares/auth.js";

const router = express.Router();

// GET API for enrollment options (dynamic from DB)
router.get("/enrollment-options",authMiddleware ,rbacMiddleware(['admin']), getEnrollmentOptions);
router.get("/organization-options", getOrganizationOptions);
export default router;

import express from "express";
import { getAdminStats, getInstructorStats, getStudentStats,getLessonStats } from "../controllers/StatsController.js";
const router = express.Router();

// GET API for enrollment options (dynamic from DB)
router.get("/admin/", getAdminStats);
router.get('/instructor/:id', getInstructorStats);
router.get('/student/:id', getStudentStats);
router.get('/course/:id', getLessonStats);
export default router;
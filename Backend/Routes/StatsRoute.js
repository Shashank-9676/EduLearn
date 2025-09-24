import express from "express";
import { getAdminStats, getInstructorStats, getStudentStats,getLessonStats } from "../controllers/StatsController.js";
import { authMiddleware, rbacMiddleware } from "../middlewares/auth.js";
const router = express.Router();

// GET API for enrollment options (dynamic from DB)
router.get("/admin/",authMiddleware,rbacMiddleware(['admin']), getAdminStats);
router.get('/instructor/:id',authMiddleware, getInstructorStats);
router.get('/student/:id',authMiddleware, getStudentStats);
router.get('/course/:id',authMiddleware, getLessonStats);
// router.get("/admin/", getAdminStats);
// router.get('/instructor/:id',getInstructorStats);
// router.get('/student/:id', getStudentStats);
// router.get('/course/:id', getLessonStats);

export default router;
import express from "express";
import { createEnrollment, getAllEnrollments, getEnrollmentById, updateEnrollment, deleteEnrollment } from "../controllers/enrollmentController.js";
import { authMiddleware, rbacMiddleware } from "../middlewares/auth.js";
const router = express.Router();
router.get("/",authMiddleware,rbacMiddleware(['admin']), getAllEnrollments);
router.get("/:id",authMiddleware,rbacMiddleware(['admin', 'instructor']), getEnrollmentById);
router.post("/",authMiddleware, createEnrollment);
router.put("/:id",authMiddleware,rbacMiddleware(['admin', 'instructor']), updateEnrollment);
router.delete("/:id",authMiddleware,rbacMiddleware(['admin', 'instructor']), deleteEnrollment);

export default router;

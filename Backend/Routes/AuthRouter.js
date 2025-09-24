import { Router } from "express";

const router = Router();
import { allUsers, changePassword, login, logout, register,getProfile, getInstructors, getStudents } from "../controllers/AuthController.js";
import { authMiddleware, rbacMiddleware } from "../middlewares/auth.js";
router.post("/register", register);
router.post("/login", login);
router.put("/change-password",authMiddleware, changePassword);
router.get("/users",authMiddleware, allUsers);
router.post("/logout",authMiddleware, logout);
router.get("/profile",authMiddleware, getProfile);
router.get("/instructors",authMiddleware,rbacMiddleware(['admin', 'instructor']), getInstructors);
router.get("/students",authMiddleware, getStudents);

export default router;
import { Router } from "express";

const router = Router();
import { allUsers, changePassword, login, logout, register,getProfile, getInstructors, getStudents } from "../controllers/AuthController.js";
router.post("/register", register);
router.post("/login", login);
router.put("/change-password", changePassword);
router.get("/users", allUsers);
router.post("/logout", logout);
router.get("/profile", getProfile);
router.get("/instructors", getInstructors);
router.get("/students", getStudents);

export default router;
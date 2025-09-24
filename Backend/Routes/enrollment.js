import express from "express";
import { createEnrollment, getAllEnrollments, getEnrollmentById, updateEnrollment, deleteEnrollment } from "../controllers/enrollmentController.js";

const router = express.Router();
router.get("/", getAllEnrollments);
router.get("/:id", getEnrollmentById);
router.post("/", createEnrollment);
router.put("/:id", updateEnrollment);
router.delete("/:id", deleteEnrollment);

export default router;

import { getAllCourses, getCourseByInstructor , getCourseById, getCourseByStudent, createCourse, updateCourse, deleteCourse } from "../controllers/CourseController.js";
import { getLessonById, createLesson, getLessonsByCourse, updateLesson, deleteLesson } from '../controllers/LessonsController.js';

import { Router } from "express";
import {  authMiddleware, rbacMiddleware } from "../middlewares/auth.js";
const router = Router();
router.get('/',  getAllCourses);
router.get('/instructor/:id',  getCourseByInstructor);
router.get('/student/:id',  getCourseByStudent);
router.get('/:id',  getCourseById);
router.post('/',   createCourse);
router.put('/:id',   updateCourse);
router.delete('/:id',   deleteCourse);

// Lesson routes
router.post("/:courseId/lessons",   createLesson);
router.get("/:courseId/lessons",  getLessonsByCourse);
router.get("/lessons/:id",  getLessonById);
router.put("/lessons/:id",   updateLesson);
router.delete("/lessons/:id",   deleteLesson);
export default router;
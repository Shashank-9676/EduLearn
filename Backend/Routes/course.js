import { getAllCourses, getCourseByInstructor , getCourseById, getCourseByStudent, createCourse, updateCourse, deleteCourse } from "../controllers/CourseController.js";
import { getLessonById, createLesson, getLessonsByCourse, updateLesson, deleteLesson } from '../controllers/LessonsController.js';

import { Router } from "express";
import {  authMiddleware, rbacMiddleware } from "../middlewares/auth.js";
const router = Router();
router.get('/',  getAllCourses);
router.get('/instructor/:id',  getCourseByInstructor);
router.get('/student/:id',authMiddleware,  getCourseByStudent);
router.get('/:id',  getCourseById);
router.post('/', authMiddleware, rbacMiddleware(['admin']), createCourse);
router.put('/:id', authMiddleware, rbacMiddleware(['admin']), updateCourse);
router.delete('/:id', authMiddleware, rbacMiddleware(['admin']), deleteCourse);

// Lesson routes
router.post("/:courseId/lessons",authMiddleware,rbacMiddleware(['admin', 'instructor']),   createLesson);
router.get("/:courseId/lessons",  getLessonsByCourse);
router.get("/lessons/:id",  getLessonById);
router.put("/lessons/:id",authMiddleware,rbacMiddleware(['admin', 'instructor']),   updateLesson);
router.delete("/lessons/:id",authMiddleware,rbacMiddleware(['admin', 'instructor']),   deleteLesson);
export default router;
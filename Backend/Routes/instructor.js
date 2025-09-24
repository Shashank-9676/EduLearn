import { Router } from "express";
// import { getInstructors } from "../controllers/AuthController";
import { addInstructor, getAllInstructors,getInstructorById,updateInstructor,deleteInstructor } from "../controllers/InstructorController.js";
import { authMiddleware, rbacMiddleware } from "../middlewares/auth.js";

const router = Router()

router.get('/',authMiddleware,rbacMiddleware(['admin', 'instructor']), getAllInstructors)
router.post('/',authMiddleware,rbacMiddleware(['admin', 'instructor']), addInstructor)
router.get('/:id',authMiddleware,rbacMiddleware(['admin', 'instructor']), getInstructorById)
router.put('/:id',authMiddleware,rbacMiddleware(['admin', 'instructor']), updateInstructor)
router.delete('/:id',authMiddleware,rbacMiddleware(['admin', 'instructor']), deleteInstructor)
export default router;
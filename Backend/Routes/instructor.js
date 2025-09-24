import { Router } from "express";
// import { getInstructors } from "../controllers/AuthController";
import { addInstructor, getAllInstructors,getInstructorById,updateInstructor,deleteInstructor } from "../controllers/InstructorController.js";


const router = Router()

router.get('/', getAllInstructors)
router.post('/', addInstructor)
router.get('/:id', getInstructorById)
router.put('/:id', updateInstructor)
router.delete('/:id', deleteInstructor)
export default router;
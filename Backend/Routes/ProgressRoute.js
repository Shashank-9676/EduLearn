import  express  from 'express';
import { addProgress,getProgressByUser,getCourseProgress } from '../controllers/ProgressController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Example GET route
router.post('/',authMiddleware, addProgress)
router.get('/lesson/:lesson_id/user/:user_id',authMiddleware, getProgressByUser);
router.get('/course/:course_id/user/:user_id',authMiddleware, getCourseProgress);
export default router;
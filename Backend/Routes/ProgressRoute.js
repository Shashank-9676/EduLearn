import  express  from 'express';
import { addProgress,getProgressByUser,getCourseProgress } from '../controllers/ProgressController.js';

const router = express.Router();

// Example GET route
router.post('/', addProgress)
router.get('/lesson/:lesson_id/user/:user_id', getProgressByUser);
router.get('/course/:course_id/user/:user_id',getCourseProgress);
export default router;
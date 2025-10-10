import { db } from '../index.js';

export const addProgress = async (req, res) => {
    try {
        const { user_id, lesson_id, status } = req.body;
        if (user_id === undefined || lesson_id === undefined || status === undefined) {
            return res.status(400).send({ message: 'Missing required fields' });
        }
        await db.execute({
            sql: 'INSERT INTO LessonProgress (user_id, lesson_id, status) VALUES (?, ?, ?)',
            args: [user_id, lesson_id, status]
        });
        res.status(201).send({ message: 'Progress added successfully' });
    } catch (error) {
        console.error('Error adding progress:', error);
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).send({ message: 'You have already completed this lesson' });
        }
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getProgressByUser = async (req, res) => {
    try {
        const { user_id, lesson_id } = req.params;
        const result = await db.execute({
            sql: 'SELECT * FROM LessonProgress WHERE user_id = ? AND lesson_id = ?',
            args: [user_id, lesson_id]
        });
        res.status(200).send({ details: result.rows[0] || null });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};

export const getCourseProgress = async (req, res) => {
    try {
        const { user_id, course_id } = req.params;

        // Get the course and its instructor
        const courseResult = await db.execute({
            sql: 'SELECT instructor_id FROM Courses WHERE id = ?',
            args: [course_id]
        });

        if (courseResult.rows.length === 0) {
            return res.status(404).send({ message: 'Course not found' });
        }
        const course = courseResult.rows[0];

        // Get the total number of lessons for the course
        const totalLessonsResult = await db.execute({
            sql: 'SELECT COUNT(*) as count FROM Lessons WHERE course_id = ?',
            args: [course_id]
        });
        const totalLessons = totalLessonsResult.rows[0].count;

        // Check if the current user is the instructor for this course
        if (course.instructor_id === Number(user_id)) {
            // User is the instructor, get progress for all enrolled students
            const progressResult = await db.execute({
                sql: `
                    SELECT 
                        u.id as user_id,
                        u.username,
                        u.email,
                        COUNT(lp.progress_id) as completed
                    FROM enrollments e
                    JOIN users u ON e.user_id = u.id
                    LEFT JOIN LessonProgress lp ON u.id = lp.user_id AND lp.status = 1
                    LEFT JOIN Lessons l ON lp.lesson_id = l.lesson_id AND l.course_id = e.course_id
                    WHERE e.course_id = ?
                    GROUP BY u.id, u.username, u.email
                `,
                args: [course_id]
            });

            const usersProgress = progressResult.rows.map(user => ({
                ...user,
                total: totalLessons,
                percent: totalLessons === 0 ? 0 : Math.round((user.completed / totalLessons) * 100)
            }));
            
            return res.status(200).send({ users: usersProgress });
        } else {
            // User is a student, get their own progress
            const completedResult = await db.execute({
                sql: `
                    SELECT COUNT(*) as count 
                    FROM LessonProgress lp 
                    JOIN Lessons l ON lp.lesson_id = l.lesson_id 
                    WHERE lp.user_id = ? AND l.course_id = ? AND lp.status = 1
                `,
                args: [user_id, course_id]
            });
            const completedCount = completedResult.rows[0].count;

            const percent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);
            
            return res.status(200).send({
                details: {
                    user_id: Number(user_id),
                    completed: completedCount,
                    total: totalLessons,
                    percent
                }
            });
        }
    } catch (error) {
        console.error('Error fetching course progress:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
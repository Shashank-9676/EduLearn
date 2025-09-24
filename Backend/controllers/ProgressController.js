import {db} from '../index.js';
export const addProgress = async (req, res) => {
    try{
        const { user_id, lesson_id, status } = req.body;
        if (!user_id || !lesson_id || !status) {
            return res.status(400).send({ message: 'Missing required fields' });
        }
        await db.run(
            'INSERT INTO lessonprogress (user_id, lesson_id, status) VALUES (?, ?, ?)',
            [user_id, lesson_id, status]
        );
        res.status(201).send({ message: 'Progress added successfully' });
    } catch (error) {
        console.error('Error adding progress:', error);
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).send({ message: 'You have already completed this lesson' });
        }
        res.status(500).send({ message: 'Internal server error' });
    }
}
export const getProgressByUser = async (req, res) => {
    try {
        const { user_id, lesson_id } = req.params;
        const progress = await db.get('SELECT * FROM lessonprogress WHERE user_id = ? AND lesson_id = ?', [user_id, lesson_id]);
        res.status(200).send({ details: progress });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
}

export const getCourseProgress = async (req, res) => {
    try {
        const { user_id, course_id } = req.params;
        // Check if user is instructor for the course
        const instructor = await db.get(
            'SELECT instructor_id FROM courses WHERE id = ?',
            [course_id]
        );
        if (!instructor) {
            return res.status(404).send({ message: 'Course not found' });
        }

        if (instructor.instructor_id === Number(user_id)) {
            // User is instructor, get progress for all enrolled users
            const users = await db.all(
                `SELECT u.id, u.username, u.email
                 FROM users u
                 JOIN enrollments e ON u.id = e.user_id
                 WHERE e.course_id = ?`,
                [course_id]
            );
            const totalLessons = await db.get(
                'SELECT COUNT(*) as count FROM lessons WHERE course_id = ?',
                [course_id]
            );
            const results = [];
            for (const user of users) {
                const completed = await db.get(
                    `SELECT COUNT(*) as count
                     FROM lessonprogress lp
                     JOIN lessons l ON lp.lesson_id = l.lesson_id
                     WHERE lp.user_id = ? AND l.course_id = ?`,
                    [user.id, course_id]
                );
                const percent = totalLessons.count === 0 ? 0 : Math.round((completed.count / totalLessons.count) * 100);
                results.push({
                    user_id: user.id,
                    name: user.name,
                    email: user.email,
                    completed: completed.count,
                    total: totalLessons.count,
                    percent
                });
            }
            return res.status(200).send({ users: results });
        } else {
            // User is not instructor, get their own progress
            const totalLessons = await db.get(
                'SELECT COUNT(*) as count FROM lessons WHERE course_id = ?',
                [course_id]
            );
            const completed = await db.get(
                `SELECT COUNT(*) as count
                 FROM lessonprogress lp
                 JOIN lessons l ON lp.lesson_id = l.lesson_id
                 WHERE lp.user_id = ? AND l.course_id = ? AND lp.status = '1'`,
                [user_id, course_id]
            );
            const percent = totalLessons.count === 0 ? 0 : Math.round((completed.count / totalLessons.count) * 100);
            return res.status(200).send({details : {
                user_id: Number(user_id),
                completed: completed.count,
                total: totalLessons.count,
                percent
            }});
        }
    } catch (error) {
        console.error('Error fetching course progress:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
};
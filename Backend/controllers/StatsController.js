import { db } from "../index.js";
export const getAdminStats = async (req, res) => {
  try {
    const totalUsersRow = await db.get(`SELECT COUNT(distinct user_id) AS count FROM enrollments where organization_id = ?`, [req.user.organization_id]);
    const totalCoursesRow = await db.get(`SELECT COUNT(*) AS count FROM courses where organization_id = ?`, [req.user.organization_id]);
    const activeUsersRow = await db.get(`SELECT COUNT(distinct user_id) AS count FROM enrollments WHERE status = 'active' and organization_id = ?`, [req.user.organization_id]);
    const pendingEnrollmentsRow = await db.get(`SELECT COUNT(*) AS count FROM enrollments WHERE status = 'pending' and organization_id = ?`, [req.user.organization_id]);

    const stats = {
      totalUsers: totalUsersRow.count,
      totalCourses: totalCoursesRow.count,
      activeUsers: activeUsersRow.count,
      pendingEnrollments: pendingEnrollmentsRow.count
    };

    res.json({details: stats});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error fetching statistics"});
  }
}

export const getInstructorStats = async(req,res) => {
    const instructorId = req.params.id;
    try {
      const totalCoursesRow = await db.get(`SELECT COUNT(*) AS count FROM courses WHERE instructor_id = ?`, [instructorId]);
      const totalStudentsRow = await db.get(`SELECT COUNT(DISTINCT user_id) AS count FROM enrollments WHERE course_id IN (SELECT id FROM courses WHERE instructor_id = ?)`, [instructorId]);
    //   const activeCoursesRow = await db.get(`SELECT COUNT(*) AS count FROM courses WHERE instructor_id = ? AND status = 'active'`, [instructorId]);
    //   const completedCoursesRow = await db.get(`SELECT COUNT(*) AS count FROM courses WHERE instructor_id = ? AND status = 'completed'`, [instructorId]);

      const stats = {
        totalCourses: totalCoursesRow.count,
        totalStudents: totalStudentsRow.count,
        // activeCourses: activeCoursesRow.count,
        // completedCourses: completedCoursesRow.count
      };

      res.json({details: stats});
    } catch (err) {
      console.error(err);
      res.status(500).json({message: "Error fetching instructor statistics"});
    }
}

export const getStudentStats = async(req,res) => {
    const studentId = req.params.id;
    try {
      const totalCoursesRow = await db.get(`SELECT COUNT(*) AS count FROM enrollments WHERE user_id = ?`, [studentId]);
      const stats = {
        totalCourses: totalCoursesRow.count,
      };
      res.json({details: stats});
    } catch (err) {
      console.error(err);
      res.status(500).json({message: "Error fetching student statistics"});
    }
}

export const getLessonStats = async(req,res) => {
    const courseId = req.params.id;
    try {
        const totalLessonsRow = await db.get(`SELECT COUNT(*) AS count FROM lessons WHERE course_id = ?`, [courseId]);
        const enrolledStudentsRow = await db.get(`SELECT COUNT(DISTINCT user_id) AS count FROM enrollments WHERE course_id = ? AND status = 'active'`, [courseId]);
        const stats = {
            totalLessons: totalLessonsRow.count,
            enrolledStudents: enrolledStudentsRow.count
        };
        res.json({details: stats});
    } catch (err) {
        console.error(err);
        res.status(500).json({message: "Error fetching lesson statistics"});
    }
}
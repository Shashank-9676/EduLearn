import { db } from "../index.js";

export const getAdminStats = async (req, res) => {
  try {
    // Run all count queries in parallel for better performance
    const [
      totalUsersResult,
      totalCoursesResult,
      activeUsersResult,
      pendingEnrollmentsResult
    ] = await Promise.all([
      db.execute({
        sql: `SELECT COUNT(DISTINCT user_id) AS count FROM enrollments WHERE organization_id = ?`,
        args: [req.user.organization_id]
      }),
      db.execute({
        sql: `SELECT COUNT(*) AS count FROM Courses WHERE organization_id = ?`,
        args: [req.user.organization_id]
      }),
      db.execute({
        sql: `SELECT COUNT(DISTINCT user_id) AS count FROM enrollments WHERE status = 'active' AND organization_id = ?`,
        args: [req.user.organization_id]
      }),
      db.execute({
        sql: `SELECT COUNT(*) AS count FROM enrollments WHERE status = 'pending' AND organization_id = ?`,
        args: [req.user.organization_id]
      })
    ]);

    const stats = {
      totalUsers: totalUsersResult.rows[0].count,
      totalCourses: totalCoursesResult.rows[0].count,
      activeUsers: activeUsersResult.rows[0].count,
      pendingEnrollments: pendingEnrollmentsResult.rows[0].count
    };

    res.json({ details: stats });
  } catch (err) {
    console.error("Error fetching admin statistics:", err);
    res.status(500).json({ message: "Error fetching statistics" });
  }
};

export const getInstructorStats = async (req, res) => {
  const instructorId = req.params.id;
  try {
    const [totalCoursesResult, totalStudentsResult] = await Promise.all([
      db.execute({
        sql: `SELECT COUNT(*) AS count FROM Courses WHERE instructor_id = ?`,
        args: [instructorId]
      }),
      db.execute({
        sql: `SELECT COUNT(DISTINCT user_id) AS count FROM enrollments WHERE course_id IN (SELECT id FROM Courses WHERE instructor_id = ?)`,
        args: [instructorId]
      })
    ]);

    const stats = {
      totalCourses: totalCoursesResult.rows[0].count,
      totalStudents: totalStudentsResult.rows[0].count,
    };

    res.json({ details: stats });
  } catch (err) {
    console.error("Error fetching instructor statistics:", err);
    res.status(500).json({ message: "Error fetching instructor statistics" });
  }
};

export const getStudentStats = async (req, res) => {
  const studentId = req.params.id;
  try {
    const totalCoursesResult = await db.execute({
      sql: `SELECT COUNT(*) AS count FROM enrollments WHERE user_id = ?`,
      args: [studentId]
    });

    const stats = {
      totalCourses: totalCoursesResult.rows[0].count,
    };
    res.json({ details: stats });
  } catch (err) {
    console.error("Error fetching student statistics:", err);
    res.status(500).json({ message: "Error fetching student statistics" });
  }
};

export const getLessonStats = async (req, res) => {
  const courseId = req.params.id;
  try {
    const [totalLessonsResult, enrolledStudentsResult] = await Promise.all([
        db.execute({
            sql: `SELECT COUNT(*) AS count FROM Lessons WHERE course_id = ?`,
            args: [courseId]
        }),
        db.execute({
            sql: `SELECT COUNT(DISTINCT user_id) AS count FROM enrollments WHERE course_id = ? AND status = 'active'`,
            args: [courseId]
        })
    ]);

    const stats = {
      totalLessons: totalLessonsResult.rows[0].count,
      enrolledStudents: enrolledStudentsResult.rows[0].count
    };
    res.json({ details: stats });
  } catch (err) {
    console.error("Error fetching lesson statistics:", err);
    res.status(500).json({ message: "Error fetching lesson statistics" });
  }
};
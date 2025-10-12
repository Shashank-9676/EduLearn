import { db } from "../index.js";

export const getAllEnrollments = async (req, res) => {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          e.id, 
          e.status,
          e.enrolled_at,
          i.username AS instructor_name, 
          u.username AS student_name, 
          u.user_type, 
          u.email AS student_email,
          c.title as course_title
        FROM enrollments e
        LEFT JOIN users u ON e.user_id = u.id
        LEFT JOIN courses c ON e.course_id = c.id
        LEFT JOIN users i ON c.instructor_id = i.id
        WHERE u.organization_id = ?
        ORDER BY e.enrolled_at DESC
      `,
      args: [req.user.organization_id],
    });
    return res.json({ details: result.rows });
  } catch (err) {
    console.error("getAllEnrollments:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

export const getEnrollmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          e.id, 
          e.user_id, 
          u.username AS student_name, 
          e.course_id, 
          c.title AS course_title, 
          c.instructor_id, 
          i.username AS instructor_name, 
          e.enrolled_at, 
          e.status 
        FROM enrollments e
        LEFT JOIN users u ON e.user_id = u.id
        LEFT JOIN courses c ON e.course_id = c.id
        LEFT JOIN users i ON c.instructor_id = i.id
        WHERE e.id = ?
      `,
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    return res.json({ details: result.rows[0] });
  } catch (err) {
    console.error("getEnrollmentById:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

export const createEnrollment = async (req, res) => {
  const { user_id, course_id, status = "pending" } = req.body;

  if (!user_id || !course_id) {
    return res.status(400).json({ message: "Enter required Fields" });
  }

  try {
    const studentResult = await db.execute({
        sql: `SELECT * FROM users WHERE id = ?`,
        args: [user_id]
    });
    if (studentResult.rows.length === 0) return res.status(400).json({ message: "User not found" });

    const courseResult = await db.execute({
        sql: `SELECT * FROM courses WHERE id = ?`,
        args: [course_id]
    });
    if (courseResult.rows.length === 0) return res.status(400).json({ message: "Course not found" });

    const course = courseResult.rows[0];

    const result = await db.execute({
      sql: `
        INSERT INTO enrollments (user_id, course_id, instructor_id, enrolled_at, status, organization_id)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?, ?)
      `,
      args: [user_id, course_id, course.instructor_id, status, req.user.organization_id],
    });

    return res.status(201).json({
      id: Number(result.lastInsertRowid),
      user_id: user_id,
      course_id,
      instructor_id: course.instructor_id,
      status,
    });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT") {
      return res.status(409).json({ message: "You are already enrolled in this course" });
    }
    console.error("createEnrollment:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

export const updateEnrollment = async (req, res) => {
  const { id } = req.params;
  const { user_id, course_id, status } = req.body;

  try {
    const existingResult = await db.execute({
        sql: `SELECT * FROM enrollments WHERE id = ?`,
        args: [id]
    });
    if (existingResult.rows.length === 0) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    const existing = existingResult.rows[0];

    const newUserId = user_id ?? existing.user_id;
    const newCourseId = course_id ?? existing.course_id;
    const newStatus = status ?? existing.status;

    // Additional validations (optional but good practice)
    if (user_id) {
        const studentResult = await db.execute({sql: `SELECT * FROM users WHERE id = ?`, args: [newUserId]});
        if (studentResult.rows.length === 0) return res.status(400).json({ message: "Student (user_id) not found" });
    }
    if (course_id) {
        const courseResult = await db.execute({sql: `SELECT * FROM courses WHERE id = ?`, args: [newCourseId]});
        if (courseResult.rows.length === 0) return res.status(400).json({ message: "Course not found" });
    }

    const result = await db.execute({
      sql: `UPDATE enrollments SET user_id = ?, course_id = ?, status = ? WHERE id = ?`,
      args: [newUserId, newCourseId, newStatus, id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Enrollment not found or no changes made" });
    }

    const updatedResult = await db.execute({sql: `SELECT * FROM enrollments WHERE id = ?`, args: [id]});
    return res.json({ message: "Enrollment updated", enrollment: updatedResult.rows[0] });
  } catch (err) {
    if (err.code === "SQLITE_CONSTRAINT") {
      return res.status(409).json({ message: "Enrollment constraint failed. Check for duplicates." });
    }
    console.error("updateEnrollment:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

export const deleteEnrollment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.execute({
        sql: `DELETE FROM enrollments WHERE id = ?`,
        args: [id]
    });
    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    return res.json({ message: "Enrollment deleted" });
  } catch (err) {
    console.error("deleteEnrollment:", err);
    return res.status(500).json({ error: "Database error" });
  }
};
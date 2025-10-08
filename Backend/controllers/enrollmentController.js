import {db} from "../index.js";

const isType = (user, expected) =>
  user && user.user_type && user.user_type.toLowerCase() === expected.toLowerCase();
export const getAllEnrollments = async (req, res) => {
  try {
    const rows = await db.all(
      `SELECT *, e.id, i.username AS instructor_name, u.username AS student_name, u.user_type, u.email AS student_email FROM enrollments e
       LEFT JOIN users u ON e.user_id = u.id
       LEFT JOIN courses c ON e.course_id = c.id
       LEFT JOIN users i ON e.instructor_id = i.id
       WHERE u.organization_id = ?
       ORDER BY e.enrolled_at DESC`,
      [req.user.organization_id]
    );
    return res.json({details : rows});
  } catch (err) {
    console.error("getAllEnrollments:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

/* GET /enrollments/:id */
export const getEnrollmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const row = await db.get(
      `SELECT e.id, e.user_id, u.username AS student_name, e.course_id, c.title AS course_title, e.instructor_id, i.username AS instructor_name, e.enrolled_at, e.status FROM enrollments e
       LEFT JOIN users u ON e.user_id = u.id
       LEFT JOIN courses c ON e.course_id = c.id
       LEFT JOIN users i ON e.instructor_id = i.id
       WHERE e.id = ?`,
      [id]
    );
    if (!row) return res.status(404).json({ message: "Enrollment not found" });
    return res.json(row);
  } catch (err) {
    console.error("getEnrollmentById:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

/* POST /enrollments
   Body: { user_id, course_id, instructor_id, status? }
   - validates existence of user, course, instructor
   - ensures instructor is an instructor and user is a student (optional, but implemented) */
export const createEnrollment = async (req, res) => {
  console.log(1)
  const { user_id, course_id, status = "pending" } = req.body;

  if (!user_id || !course_id) {
    return res.status(400).json({ message: "Enter required Fields" });
  }

  try {
    console.log(1)
    const student = await db.get(`SELECT * FROM users WHERE id = ?`, [user_id]);
    if (!student) return res.status(400).json({ message: "User not found" });
    console.log(1)
    // validate course
    const course = await db.get(`SELECT * FROM courses WHERE id = ?`, [course_id]);
    if (!course) return res.status(400).json({ message: "Course not found" });
    console.log(1)

    console.log(course)
    // Insert enrollment
    try {
      const result = await db.run(
        `INSERT INTO enrollments (user_id, course_id, instructor_id, enrolled_at, status)
         VALUES (?, ?, ?, CURRENT_TIMESTAMP, ?)`,
        [user_id, course_id, course.instructor_id, status]
      );

      return res.status(201).json({
        id: result.lastID,
        user_id,
        course_id,
        instructor_id : course.instructor_id,
        status,
      });
    } catch (insertErr){
      // handle unique constraint violation
      if (insertErr && insertErr.code === "SQLITE_CONSTRAINT") {
        return res.status(409).json({ message: "You are already enrolled in this course" });
      }
      console.error("createEnrollment - insertErr:", insertErr);
      return res.status(500).json({ error: "Failed to create enrollment" });
    }
  } catch (err) {
    console.error("createEnrollment:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

/* PUT /enrollments/:id
   Allows partial updates (user_id, course_id, instructor_id, status) */
export const updateEnrollment = async (req, res) => {
  const { id } = req.params;
  const { user_id, course_id, instructor_id, status } = req.body;

  try {
    const existing = await db.get(`SELECT * FROM enrollments WHERE id = ?`, [id]);
    if (!existing) return res.status(404).json({ message: "Enrollment not found" });

    // Determine new values (fallback to existing)
    const newUserId = user_id ?? existing.user_id;
    const newCourseId = course_id ?? existing.course_id;
    const newInstructorId = instructor_id ?? existing.instructor_id;
    const newStatus = status ?? existing.status;

    // Validate student if changed
    if (user_id) {
      const student = await db.get(`SELECT * FROM users WHERE id = ?`, [newUserId]);
      if (!student) return res.status(400).json({ message: "Student (user_id) not found" });
      if (!isType(student, "student")) {
        return res.status(400).json({ message: "user_id must belong to a Student" });
      }
    }

    // Validate course if changed
    if (course_id) {
      const course = await db.get(`SELECT * FROM courses WHERE id = ?`, [newCourseId]);
      if (!course) return res.status(400).json({ message: "Course not found" });
      // optionally check instructor-course relationship below
    }

    // Validate instructor if changed
    if (instructor_id) {
      const instructor = await db.get(`SELECT * FROM users WHERE id = ?`, [newInstructorId]);
      if (!instructor) return res.status(400).json({ message: "Instructor (instructor_id) not found" });
      if (!isType(instructor, "instructor")) {
        return res.status(400).json({ message: "instructor_id must belong to an Instructor" });
      }
    }
    const result = await db.run(
      `UPDATE enrollments SET user_id = ?, course_id = ?, instructor_id = ?, status = ? WHERE id = ?`,
      [newUserId, newCourseId, newInstructorId, newStatus, id]
    );

    if (result.changes === 0) {
      return res.status(500).json({ message: "No changes applied" });
    }

    const updated = await db.get(`SELECT * FROM enrollments WHERE id = ?`, [id]);
    return res.json({ message: "Enrollment updated", enrollment: updated });
  } catch (err) {
    if (err && err.code === "SQLITE_CONSTRAINT") {
      return res.status(409).json({ message: "You are already enrolled in this course" });
    }
    console.error("updateEnrollment:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

/* DELETE /enrollments/:id */
export const deleteEnrollment = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.run(`DELETE FROM enrollments WHERE id = ?`, [id]);
    if (result.changes === 0) return res.status(404).json({ message: "Enrollment not found" });
    return res.json({ message: "Enrollment deleted" });
  } catch (err) {
    console.error("deleteEnrollment:", err);
    return res.status(500).json({ error: "Database error" });
  }
};

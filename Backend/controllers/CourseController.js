import { db } from "../index.js";

export const getAllCourses = async (req, res) => {
  try {
    const courseResult = await db.execute({
      sql: `
        SELECT c.*, u.username as instructor
        FROM courses c
        LEFT JOIN users u ON c.instructor_id = u.id
        WHERE c.organization_id = ?
      `,
      args: [req.user.organization_id],
    });
    res.status(200).json({ status: "success", details: courseResult.rows });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const getCourseByInstructor = async (req, res) => {
  const { id } = req.params;
  try {
    const courseResult = await db.execute({
      sql: `SELECT * FROM courses WHERE instructor_id = ?`,
      args: [id]
    });

    res.json({ details: courseResult.rows });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCourseByStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const courseResult = await db.execute({
        sql: `
            SELECT c.*, u.username as instructor
            FROM enrollments e
            INNER JOIN courses c ON e.course_id = c.id
            INNER JOIN users u ON c.instructor_id = u.id
            WHERE e.student_id = ?
        `,
        args: [id]
    });
    res.json({ details: courseResult.rows });
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, category, instructor_id, level, created_by } = req.body;

    const userResult = await db.execute({
        sql: `SELECT user_type FROM users WHERE id = ?`,
        args: [created_by]
    });

    if (userResult.rows.length === 0 || userResult.rows[0].user_type !== 'admin') {
      return res.status(403).send({ message: "Only admins can create courses" });
    }

    const result = await db.execute({
      sql: `
        INSERT INTO courses (name, description, category, instructor_id, level, organization_id) 
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      // NOTE: The `created_by` column doesn't exist in the schema you provided earlier. 
      // I've omitted it from the INSERT statement. Add it back if you've updated your table.
      args: [title, description, category, instructor_id, level, req.user.organization_id]
    });

    // There is no `course_id` in your `users` or a separate `instructors` table schema.
    // If you need to link a course back to an instructor, it's usually done via the `courses` table.
    // The line below is commented out as it would cause an error.
    // await db.execute(`UPDATE users SET course_id = ? WHERE id = ?`, [result.lastInsertRowid, instructor_id]);

    res.status(200).send({ message: "Course created successfully!", details: result });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, /* created_by, instructor_id, category, level */ } = req.body;
  try {
    const result = await db.execute({
      sql: `UPDATE courses SET name = ?, description = ? WHERE id = ?`,
      args: [title, description, id]
    });

    if (result.rowsAffected > 0) {
      res.json({ message: "Course updated successfully!", details: { id, title, description } });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.execute({
        sql: `DELETE FROM courses WHERE id = ?`,
        args: [id]
    });
    if (result.rowsAffected > 0) {
      res.json({ message: "Course deleted successfully" });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const courseResult = await db.execute({
        sql: `
            SELECT c.*, u.username as instructor
            FROM courses c
            LEFT JOIN users u ON c.instructor_id = u.id
            WHERE c.id = ?
        `,
        args: [id]
    });

    if (courseResult.rows.length > 0) {
      res.json({ details: courseResult.rows[0] });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
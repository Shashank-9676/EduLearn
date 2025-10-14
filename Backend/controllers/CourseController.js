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
        sql: `SELECT *, courses.id as id FROM enrollments inner join courses on enrollments.course_id = courses.id inner join users on courses.instructor_id = users.id WHERE user_id = ?`,
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
        INSERT INTO courses (title, description, category, instructor_id, level, organization_id, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      args: [title, description, category, instructor_id, level, req.user.organization_id, created_by]
    });
    const instructorCheck = await db.execute({
      sql: `SELECT course_id FROM instructors WHERE instructor_id = ?`,
      args: [instructor_id]
    });

    if (instructorCheck.rows.length > 0) {
      if (instructorCheck.rows[0].course_id === null) {
      await db.execute({
        sql: `UPDATE instructors SET course_id = ? WHERE instructor_id = ?`,
        args: [Number(result.lastInsertRowid), instructor_id]
      });
      }
    } else {
      await db.execute({
      sql: `INSERT INTO instructors (instructor_id, course_id, department) VALUES (?, ?, ?)`,
      args: [instructor_id, Number(result.lastInsertRowid), instructorCheck.rows[0].department]
      });
    }
    res.status(200).send({ message: "Course created successfully!", details: result });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await db.execute({
      sql: `UPDATE courses SET title = ?, description = ? WHERE id = ?`,
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
    // Delete lesson progress for lessons in this course
    await db.execute({
      sql: `
        DELETE FROM lessonProgress 
        WHERE lesson_id IN (SELECT lesson_id FROM lessons WHERE course_id = ?)
      `,
      args: [id]
    });

    // Delete lessons of this course
    await db.execute({
      sql: `DELETE FROM lessons WHERE course_id = ?`,
      args: [id]
    });

    // Set course_id to null in instructors table for this course
    await db.execute({
      sql: `UPDATE instructors SET course_id = NULL WHERE course_id = ?`,
      args: [id]
    });

    // Delete the course itself
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
import { db } from '../index.js';

export const getAllInstructors = async (req, res) => {
  try {
    const result = await db.execute({
      sql: `
        SELECT 
          i.id,
          i.instructor_id,
          i.course_id,
          i.department,
          u.username,
          u.email,
          u.contact
        FROM instructors i
        JOIN users u ON i.instructor_id = u.id
        WHERE u.organization_id = ?
      `,
      args: [req.user.organization_id]
    });
    res.json({ details: result.rows });
  } catch (err) {
    console.error("Error fetching instructors:", err);
    res.status(500).json({ message: "Error fetching instructors" });
  }
};

export const addInstructor = async (req, res) => {
  try {
    const { instructor_id, course_id, department } = req.body;

    await db.execute({
      sql: `UPDATE users SET user_type = 'instructor' WHERE id = ?`,
      args: [instructor_id]
    });

    const result = await db.execute({
      sql: `INSERT INTO instructors (instructor_id, course_id, department) VALUES (?, ?, ?)`,
      args: [instructor_id, course_id, department]
    });

    res.status(201).json({ message: "Instructor added successfully", id: Number(result.lastInsertRowid) });
  } catch (err) {
    console.error("Error adding instructor:", err);
    res.status(500).json({ message: "Error adding instructor" });
  }
};

export const getInstructorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute({
      sql: `
        SELECT 
          i.id,
          i.instructor_id,
          i.course_id,
          i.department,
          u.username,
          u.email,
          u.contact
        FROM instructors i
        JOIN users u ON i.instructor_id = u.id
        WHERE i.id = ?
      `,
      args: [id]
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    res.json({ details: result.rows[0] });
  } catch (err) {
    console.error("Error fetching instructor:", err);
    res.status(500).json({ message: "Error fetching instructor" });
  }
};

export const updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const { course_id, department } = req.body;

    const result = await db.execute({
      sql: `UPDATE instructors SET course_id = ?, department = ? WHERE id = ?`,
      args: [course_id, department, id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    res.json({ message: "Instructor updated successfully" });
  } catch (err) {
    console.error("Error updating instructor:", err);
    res.status(500).json({ message: "Error updating instructor" });
  }
};

export const deleteInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute({
      sql: `DELETE FROM instructors WHERE id = ?`,
      args: [id]
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Instructor not found" });
    }
    res.json({ message: "Instructor deleted successfully" });
  } catch (err) {
    console.error("Error deleting instructor:", err);
    res.status(500).json({ message: "Error deleting instructor" });
  }
};
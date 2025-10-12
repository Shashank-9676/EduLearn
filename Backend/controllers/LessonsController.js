import { db } from "../index.js";

// Create a new lesson for a specific course
export const createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, content_url, created_by, lesson_order } = req.body;

    if (!title || !content_url || !created_by) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    const result = await db.execute({
      sql: `
        INSERT INTO Lessons (course_id, title, content_url, created_by, lesson_order, organization_id) 
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [courseId, title, content_url, created_by, lesson_order, req.user.organization_id],
    });

    res.status(201).json({ 
      message: "Lesson created successfully", 
      details: { id: Number(result.lastInsertRowid), courseId, title, content_url, created_by, lesson_order } 
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
  
// Get all lessons for a given course
export const getLessonsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const result = await db.execute({
      sql: `SELECT * FROM Lessons WHERE course_id = ? ORDER BY lesson_order`,
      args: [courseId],
    });
    res.json({ details: result.rows });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Get a single lesson by its ID
export const getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.execute({
      sql: `SELECT * FROM Lessons WHERE lesson_id = ?`,
      args: [id],
    });

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.json({ details: result.rows[0] });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Update a lesson's details
export const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content_url } = req.body;

    const result = await db.execute({
      sql: `UPDATE Lessons SET title = ?, content_url = ? WHERE lesson_id = ?`,
      args: [title, content_url, id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.json({ message: "Lesson updated successfully" });
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a lesson
export const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute({
      sql: `DELETE FROM LessonProgress WHERE lesson_id = ?`,
      args: [id],
    });
    const result = await db.execute({
      sql: `DELETE FROM Lessons WHERE lesson_id = ?`,
      args: [id],
    });

    if (result.rowsAffected === 0) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    res.json({ message: "Lesson deleted successfully" });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
// controllers/lessonController.js
import { db } from "../index.js";
export const createLesson = async(req, res) => {
  const { courseId } = req.params;
  const { title, content_url, created_by, lesson_order } = req.body;

  if (!title || !content_url || !created_by) {
    return res.status(400).json({ message: "All fields are required" });
  }

  await db.run(
    `INSERT INTO lessons (course_id, title, content_url, created_by, lesson_order) VALUES (?, ?, ?, ?, ?)`,
    [courseId, title, content_url, created_by, lesson_order]
  );

  res.status(201).json({message:"Lesson created successfully", details: { courseId, title, content_url, created_by, lesson_order } });
}
  
// Get all lessons for a course
export const getLessonsByCourse = async (req, res) => {
  const { courseId } = req.params;

  const lessons = await db.all(`SELECT * FROM lessons WHERE course_id = ? order by lesson_order`, [courseId]);
  res.json({details : lessons});
};

// Get single lesson by ID
export const getLessonById = async (req, res) => {
  const { id } = req.params;

  const lesson = await db.get(`SELECT * FROM lessons WHERE id = ?`, [id]);
  if (!lesson) return res.status(404).json({ message: "Lesson not found" });
  res.json({details:lesson});
};

// Update a lesson
export const updateLesson = async (req, res) => {
  const { id } = req.params;
  const { title, content_url,lesson_order } = req.body;

  await db.run(
    `UPDATE lessons SET title = ?, content_url = ?, lesson_order = ? WHERE id = ?`,
    [title, content_url, lesson_order, id]
  );

  const changes = db.changes;
  if (changes === 0) return res.status(404).json({ message: "Lesson not found" });
  res.json({ message: "Lesson updated successfully" });
};

// Delete a lesson
export const deleteLesson = async (req, res) => {
  const { id } = req.params;

  await db.run(`DELETE FROM lessons WHERE id = ?`, [id]);

  const changes = db.changes;
  if (changes === 0) return res.status(404).json({ message: "Lesson not found" });
  res.json({ message: "Lesson deleted successfully" });
};

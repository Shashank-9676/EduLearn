import { db } from "../index.js";
export const getAllCourses = async (req, res) => {
  try {
    const courses = await db.all(`SELECT *, username as instructor  FROM courses left join users on courses.instructor_id = users.id`);
    res.status(200).json({ status: "success", details: courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};

export const getCourseByInstructor = async (req, res) => {
  const { id } = req.params;
  try {
    const courses = await db.all(`SELECT * FROM courses WHERE instructor_id = ${id}`);
    if (courses) {
      res.json({details : courses});
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
export const getCourseByStudent = async (req, res) => {
  const { id } = req.params;
  try {
    // get instructor details along with course details
    const courses = await db.all(`SELECT *, courses.id as id FROM enrollments inner join courses on enrollments.course_id = courses.id
      inner join users on courses.instructor_id = users.id
       WHERE user_id = ${id}`);
    if (courses) {
      res.json({details : courses});
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createCourse = async (req, res) => {
  const { title, description, category, instructor_id, level, created_by } = req.body;

  // check if user is admin
  const user = await db.get(`SELECT * FROM users WHERE id = ${created_by}`);
  if (!user || user.user_type !== "admin") {
    return res.status(403).send({message : "Only admins can create courses"});
  }

  const result = await db.run(
    `INSERT INTO courses (title, description, category, instructor_id, level, created_by) VALUES ('${title}', '${description}', '${category}', ${instructor_id}, '${level}', ${created_by})`);
  res.status(200).send({message:"Course created successfully!"});
  await db.run(`UPDATE instructors SET course_id = '${result.lastID}' WHERE id = ${instructor_id}`);
}

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title, description, created_by, instructor_id, category, level } = req.body;
  try {
    const result = await db.run(
      `UPDATE courses SET title = ?, description = ?, created_by = ?, instructor_id = ?, category = ?, level = ? WHERE course_id = ?`,
      [title, description, created_by, instructor_id, category, level, id]
    );
    if (result.changes > 0) {
      res.json({message:"Course updated successfully!",details : { id, title, description, created_by, instructor_id, category, level }});
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
    const result = await db.run(`DELETE FROM courses WHERE course_id = ?`, [id]);
    if (result.changes > 0) {
      res.json({message : "Course deleted successfully"});
    } else {
      res.status(404).json({ message: "Course not found" });
    }

}catch (error) {
    console.error("Error deleting course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await db.get(`SELECT *, username as instructor  FROM courses left join users on courses.instructor_id = users.id WHERE courses.id = ${id}`);
    if (course) {
      res.json({details : course});
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    console.error("Error fetching course:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
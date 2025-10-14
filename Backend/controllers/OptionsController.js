import { db } from "../index.js";

export const getEnrollmentOptions = async (req, res) => {
  try {
    const usersResult = await db.execute({
      sql: "SELECT id AS value, username AS label, email FROM users WHERE user_type = 'student' AND organization_id = ?",
      args: [req.user.organization_id]
    });

    const coursesResult = await db.execute({
      sql: "SELECT id AS value, title AS label FROM Courses WHERE organization_id = ?",
      args: [req.user.organization_id]
    });

    const instructorsResult = await db.execute({
        sql: "SELECT id AS value, username AS label FROM users WHERE user_type = 'instructor' AND organization_id = ?",
        args: [req.user.organization_id]
    });

    res.json({
      users: usersResult.rows,
      courses: coursesResult.rows,
      instructors: instructorsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching enrollment options:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getOrganizationOptions = async (req, res) => {
  try {
    const organizationsResult = await db.execute("SELECT id, name FROM organizations");
    res.json({ details: organizationsResult.rows });
  } catch (error) {
    console.error("Error fetching organization options:", error);
    res.status(500).json({ error: "Server error" });
  }
};
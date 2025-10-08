import {db} from "../index.js";

export const getEnrollmentOptions = async (req, res) => {
  try {
    const users = await db.all(
      "SELECT id AS value, username AS label, email FROM users WHERE user_type IN ('student', 'instructor')"
    );

    const courses = await db.all(
      "SELECT id AS value, title AS label FROM courses"
    );

    const instructors = await db.all("SELECT id AS value, username AS label FROM users WHERE user_type = 'instructor'");

    // Static options (can also come from DB if needed)
    const userTypes = [
      { value: "instructor", label: "Instructor" },
      { value: "student", label: "Student" }
    ];

    const statuses = [
      { value: "active", label: "Active" },
      { value: "pending", label: "Pending" },
      { value: "inactive", label: "Inactive" },
      { value: "suspended", label: "Suspended" }
    ];

    res.json({
      users,
      courses,
      instructors,
      userTypes,
      statuses
    });
  } catch (error) {
    console.error("Error fetching enrollment options:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getOrganizationOptions = async (req, res) => {
  try {
    const organizations = await db.all("SELECT id, name FROM organizations");
    res.json({ details : organizations });
  } catch (error) {
    console.error("Error fetching organization options:", error);
    res.status(500).json({ error: "Server error" });
  }
};
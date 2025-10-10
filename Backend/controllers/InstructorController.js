import {db} from '../index.js';

export const getAllInstructors = async (req, res) => {
    try {
        const instructors = await db.all(`SELECT *,i.id as id  FROM Instructors i left join users on i.instructor_id = users.id where users.organization_id = ?`, [req.user.organization_id]);
        res.json({ details: instructors }); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching instructors" });
    }
}

export const addInstructor = async (req, res) => {
    try {
        const { instructor_id, course_id, department, user_type = "instructor" } = req.body;
        await db.run(`update users set user_type = ? where id = ?`, [user_type, instructor_id]);
        const result = await db.run(`INSERT INTO Instructors (instructor_id, course_id, department) VALUES (?, ?, ?)`, [instructor_id, course_id, department]);
        res.status(201).json({ message: "Instructor added successfully", id: result.lastID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error adding instructor" });
    }
};
export const getInstructorById = async (req, res) => {
    try {
        const { id } = req.params;
        const instructor = await db.get(`SELECT * FROM Instructors WHERE id = ?`, [id]);
        if (!instructor) {
            return res.status(404).json({ message: "Instructor not found" });
        }
        res.json({ details: instructor });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching instructor" });
    }
};
export const updateInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const {  course_id } = req.body;
        const result = await db.run(`UPDATE Instructors SET course_id = ? WHERE id = ?`, [course_id, id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Instructor not found" });
        }
        res.json({ message: "Instructor updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error updating instructor" });
    }
};
export const deleteInstructor = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.run(`DELETE FROM Instructors WHERE id = ?`, [id]);
        if (result.changes === 0) {
            return res.status(404).json({ message: "Instructor not found" });
        }
        res.json({ message: "Instructor deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error deleting instructor" });
    }
};
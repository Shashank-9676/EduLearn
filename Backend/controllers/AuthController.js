import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {db} from '../index.js'

export const register = async (req, res) => {
  try {
    const { username, password, email, user_type = "student", contact, organization_id } = req.body
    const existingUserResult = await db.execute({
      sql: 'SELECT * FROM users WHERE username = ?',
      args: [username],
    })

    // Correct check: See if the "rows" array has any users in it.
    if (existingUserResult.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    if (password.length < 5) {
      return res.status(400).json({ message: "Password is too short" })
    }

    const hashed = await bcrypt.hash(password, 10)
    const response = await db.execute({
      sql: `INSERT INTO users (username, password, email, user_type, contact, organization_id) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [username, hashed, email, user_type, contact, organization_id]
    })

    res.status(200).json({ message: "User created successfully", details: response })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error registering user" })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const userResult = await db.execute({
      sql: `SELECT * FROM users WHERE email = ?`,
      args: [email]
    })

    // Correct check: If no rows, the user doesn't exist.
    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "Invalid user" })
    }

    // Get the actual user object from the first row.
    const user = userResult.rows[0]

    const isPasswordMatched = await bcrypt.compare(password, user.password)
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid password" })
    }
    const payload = { username: user.username, role: user.user_type, user_id: user.id, organization_id: user.organization_id };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" })
    res.cookie("jwt_token", jwtToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 * 7
    })

    const orgResult = await db.execute({
        sql: `SELECT name FROM organizations WHERE id = ?`,
        args: [user.organization_id]
    })

    if (orgResult.rows.length > 0) {
        user.org_name = orgResult.rows[0].name
    }

    res.status(200).json({ message: "Login success!", token: jwtToken, details: user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error logging in" })
  }
}

export const changePassword = async (req, res) => {
  try {
    const { username, newPassword, oldPassword } = req.body

    const userResult = await db.execute({
        sql: `SELECT * FROM users WHERE username = ?`,
        args: [username]
    })

    if (userResult.rows.length === 0) {
      return res.status(400).json({ message: "User not found" })
    }

    const user = userResult.rows[0]

    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password)
    if (!isPasswordMatched) {
      return res.status(400).json({ message: "Invalid current password" })
    }

    if (newPassword.length < 5) {
      return res.status(400).json({ message: "Password is too short" })
    }

    const hashed = await bcrypt.hash(newPassword, 10)
    const response = await db.execute({
        sql: `UPDATE users SET password = ? WHERE username = ?`,
        args: [hashed, username]
    })

    res.status(200).json({ message: "Password updated", details: response })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error changing password" })
  }
}

export const allUsers = async (req, res) => {
  try {
    const dataResult = await db.execute(`SELECT * FROM users`)
    res.json({ details: dataResult.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching users" })
  }
}

export const logout = (req, res) => {
  res.clearCookie("jwt_token")
  res.status(200).json({ message: "Logout success!" })
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id
    const userResult = await db.execute({
        sql: `SELECT * FROM users WHERE id = ?`,
        args: [userId]
    })

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }
    res.json({ details: userResult.rows[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching user profile" })
  }
}

export const getStudents = async (req, res) => {
  try {
    const studentsResult = await db.execute({
        sql: `SELECT * FROM users WHERE user_type = 'student' and organization_id = ?`,
        args: [req.user.organization_id]
    })
    res.json({ details: studentsResult.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching students" })
  }
}
export const getInstructors = async (req, res) => {
  try {
    const instructorsResult = await db.execute({
        sql: `SELECT * FROM users WHERE user_type = 'instructor' and organization_id = ?`,
        args: [req.user.organization_id]
    })
    res.json({ details: instructorsResult.rows })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Error fetching instructors" })
  }
}
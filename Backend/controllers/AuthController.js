import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {db} from '../index.js'

export const register = async(req, res) => {
  try {
    const { username, password, email, user_type = "student", contact } = req.body;

    const existingUser = await db.get(
      `SELECT * FROM users WHERE username = ?`,
      [username]
    );

    if (existingUser) {
      return res.status(400).json({message: "User already exists"});
    }

    if (password.length < 5) {
      return res.status(400).json({message: "Password is too short"});
    }

    const hashed = await bcrypt.hash(password, 10);
    const response = await db.run(
      `INSERT INTO users (username, password, email, user_type, contact) VALUES (?, ?, ?, ?, ?)`,
      [username, hashed, email, user_type, contact]
    );

    res.status(200).json({message: "User created successfully",details: response});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error registering user"});
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.get(
      `SELECT * FROM users WHERE email = ?`,
      [email]
    );
    // console.log(user);
    if (!user) {
      return res.status(400).json({message: "Invalid user"});
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({message: "Invalid password"});
    }
    const jwtToken = jwt.sign({ username: user.username, role: user.user_type,user_id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("jwt_token", jwtToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 24*60*60*1000*7
  });

    res.status(200).json({message: "Login success!", token: jwtToken, details :user});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error logging in"});
  }
}

export const changePassword = async (req, res) => {
  try {
    const { username, newPassword, oldPassword } = req.body;

    const user = await db.get(`SELECT * FROM users WHERE username = ?`, [
      username,
    ]);

    if (!user) {
      return res.status(400).json({message: "User not found"});
    }

    const isPasswordMatched = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordMatched) {
      return res.status(400).json({message: "Invalid current password"});
    }

    if (newPassword.length < 5) {
      return res.status(400).json({message: "Password is too short"});
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    const response = await db.run(`UPDATE users SET password = ? WHERE username = ?`, [
      hashed,
      username,
    ]);

    res.status(200).json({message: "Password updated", details : response});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error changing password"});
  }
}

export const allUsers = async (req, res) => {
  try {
    const data = await db.all(`SELECT * FROM users`);
    res.json({details : data});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error fetching users"});
  }
}

export const logout = (req, res) => {
  res.clearCookie("jwt_token");
  res.status(200).json({message: "Logout success!"});
}

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const user = await db.get(`SELECT * FROM users WHERE id = ?`, [userId]);
    if (!user) {
      return res.status(404).json({message: "User not found"});
    }
    res.json({details: user});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error fetching user profile"});
  }
}

export const getStudents = async (req, res) => {
  try {
    const students = await db.all(`SELECT * FROM users WHERE user_type = 'student'`);
    res.json({details: students});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error fetching students"});
  }
}
export const getInstructors = async (req, res) => {
  try {
    const instructors = await db.all(`SELECT * FROM users WHERE user_type = 'instructor'`);
    res.json({details: instructors});
  } catch (err) {
    console.error(err);
    res.status(500).json({message: "Error fetching instructors"});
  }
}

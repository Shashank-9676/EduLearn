import express from "express";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { fileURLToPath } from "url";
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser";
import courseRoutes from './Routes/course.js'
import enrollmentRoute from './Routes/enrollment.js'
import authRoutes from './Routes/AuthRouter.js'
import formRoutes from './Routes/OptionsRoutes.js'
import instructorRoutes from './Routes/instructor.js'
import StatsRoute from './Routes/StatsRoute.js'
import ProgressRoute from './Routes/ProgressRoute.js'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
let db = null;
const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(cors(
  { origin: 'https://edu-learn-ten-dun.vercel.app',
    credentials: true
  }
));
const initializeDB = async () => {
  try {
    db = await open({
      filename: path.join(__dirname, "lms.db"),
      driver: sqlite3.Database,
    });
      
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (err) {
    console.error("DB Error:", err);
  }
};
initializeDB();
app.use('/api/', authRoutes);
app.use('/courses/', courseRoutes);
app.use('/enrollments/', enrollmentRoute);
app.use('/form/', formRoutes);
app.use('/instructors/', instructorRoutes);
app.use('/stats/', StatsRoute);
app.use('/progress/', ProgressRoute);
export {  db };

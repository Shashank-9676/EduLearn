import express from "express";
import { createClient } from '@libsql/client';
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
dotenv.config();
let db = null;
const app = express();
app.use(cookieParser())
app.use(express.json());
const allowedOrigins = [
  "http://localhost:5173",
  "https://edu-learn-ten-dun.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});

app.use('/api/', authRoutes);
app.use('/courses/', courseRoutes);
app.use('/enrollments/', enrollmentRoute);
app.use('/form/', formRoutes);
app.use('/instructors/', instructorRoutes);
app.use('/stats/', StatsRoute);
app.use('/progress/', ProgressRoute);
export {  db };

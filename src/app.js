import express from "express";
import cors from "cors";
import studentRoutes from "./routes/student.routes.js";
import notFound from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

// The Express app is created in this file, separate from server.js.
// That separation makes the app easier to test and reuse.
const app = express();

// Allow requests from other origins (useful when testing from a browser app).
app.use(cors());

// Parse JSON and URL-encoded request bodies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple health-check route so you can verify the API is running.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Management API is running",
    data: {
      endpoints: "/api/students",
    },
  });
});

// Mount all student routes under /api/students.
app.use("/api/students", studentRoutes);

// These two must come AFTER all routes:
// 1. notFound catches unmatched routes.
// 2. errorHandler formats every error consistently.
app.use(notFound);
app.use(errorHandler);

export default app;

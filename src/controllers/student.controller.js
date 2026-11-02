import mongoose from "mongoose";
import Student from "../models/student.model.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";

/**
 * Escape special characters before using user input inside a RegExp.
 * This prevents a search like "a+b" from being treated as a regular expression.
 */
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Convert a query-string value to a positive integer.
 * Returns the fallback when the value is missing or invalid.
 */
const toPositiveInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) || parsed < 1 ? fallback : parsed;
};

/**
 * POST /api/students
 * Create a new student.
 */
const createStudent = asyncHandler(async (req, res) => {
  const { name, email, age, gender, course, isActive } = req.body;

  // Normalize the email before checking for duplicates so that
  // "John@Example.com" and "john@example.com" are treated as the same address.
  const normalizedEmail =
    typeof email === "string" ? email.trim().toLowerCase() : email;

  if (normalizedEmail) {
    const existingStudent = await Student.findOne({ email: normalizedEmail });

    if (existingStudent) {
      throw new ApiError(409, "A student with this email already exists");
    }
  }

  const student = await Student.create({
    name,
    email: normalizedEmail,
    age,
    gender,
    course,
    isActive,
  });

  res.status(201).json({
    success: true,
    message: "Student created successfully",
    data: student,
  });
});

/**
 * GET /api/students?page=1&limit=10&search=john
 * Return a paginated list of students, optionally filtered by name.
 */
const getStudents = asyncHandler(async (req, res) => {
  const page = toPositiveInteger(req.query.page, 1);
  const limit = Math.min(toPositiveInteger(req.query.limit, 10), 100); // max 100 per page
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";

  // If a search term is provided, match it against the name (case-insensitive).
  const filter = search
    ? { name: { $regex: escapeRegex(search), $options: "i" } }
    : {};

  // Run both queries at the same time for better performance.
  const [students, totalStudents] = await Promise.all([
    Student.find(filter)
      .sort({ createdAt: -1 }) // newest students first
      .skip((page - 1) * limit)
      .limit(limit),
    Student.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    message: "Students retrieved successfully",
    data: {
      students,
      pagination: {
        page,
        limit,
        total: totalStudents,
        totalPages: Math.ceil(totalStudents / limit),
      },
    },
  });
});

/**
 * GET /api/students/:id
 * Return one student by their MongoDB ObjectId.
 */
const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Never query MongoDB with an invalid ObjectId - return a clear 400 instead.
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid student ID");
  }

  const student = await Student.findById(id);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  res.status(200).json({
    success: true,
    message: "Student retrieved successfully",
    data: student,
  });
});

/**
 * PUT /api/students/:id
 * Update a student. Only allowed fields are copied from the request body.
 */
const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid student ID");
  }

  const student = await Student.findById(id);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const allowedFields = ["name", "email", "age", "gender", "course", "isActive"];
  let hasUpdates = false;

  // Only update fields that were actually sent in the request body.
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      student[field] = req.body[field];
      hasUpdates = true;
    }
  }

  if (!hasUpdates) {
    throw new ApiError(400, "No valid fields were provided for update");
  }

  // If the email is being changed, make sure no other student already uses it.
  if (req.body.email !== undefined) {
    const normalizedEmail = String(req.body.email).trim().toLowerCase();
    const duplicate = await Student.findOne({
      email: normalizedEmail,
      _id: { $ne: student._id }, // exclude the student being updated
    });

    if (duplicate) {
      throw new ApiError(409, "A student with this email already exists");
    }
  }

  // save() runs all schema validators before writing to MongoDB.
  await student.save();

  res.status(200).json({
    success: true,
    message: "Student updated successfully",
    data: student,
  });
});

/**
 * DELETE /api/students/:id
 * Delete a student and return the deleted document.
 */
const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid student ID");
  }

  const student = await Student.findByIdAndDelete(id);

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  res.status(200).json({
    success: true,
    message: "Student deleted successfully",
    data: student,
  });
});

export {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};

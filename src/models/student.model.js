import mongoose from "mongoose";

/**
 * Student schema
 * --------------
 * A schema tells Mongoose what a document should look like.
 * The validators below run automatically whenever a document is saved.
 */
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // MongoDB creates a unique index so two students cannot share an email
      lowercase: true, // "John@Example.com" becomes "john@example.com"
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [1, "Age must be at least 1"],
    },

    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female, or Other",
      },
    },

    course: {
      type: String,
      required: [true, "Course is required"],
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    // Automatically adds createdAt and updatedAt date fields.
    timestamps: true,
    // Hides the internal __v field from API responses.
    versionKey: false,
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;

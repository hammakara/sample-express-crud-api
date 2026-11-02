import mongoose from "mongoose";

/**
 * Connect to MongoDB using the connection string from .env.
 *
 * Keeping this in its own file makes the database setup reusable and keeps
 * server.js focused only on starting the HTTP server.
 */
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    // Only log safe connection details - never log the full MONGO_URI because
    // it can contain a username and password.
    console.log(`MongoDB connected: ${connection.connection.host}`);
    return connection;
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    throw error;
  }
};

export default connectDB;

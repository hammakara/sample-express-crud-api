import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/database.js";

// Load environment variables from .env before using them.
dotenv.config({ quiet: true });

const PORT = process.env.PORT || 5000;

/**
 * Start the application:
 * 1. Connect to MongoDB first.
 * 2. Only start listening for HTTP requests if the database connection works.
 */
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    // Stop the server gracefully when the process is terminated.
    const shutdown = () => {
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);
  } catch (error) {
    // The database configuration file already logged the reason.
    process.exit(1);
  }
};

startServer();

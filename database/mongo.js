// Import required modules
const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

// DatabaseConnector class for handling MongoDB connections
class DatabaseConnector {
  constructor(dbUri) {
    this.dbUri = dbUri;

    mongoose.connection.on("error", (error) => {
      console.error("Database connection error:", error);
      throw new Error("MongoDB Connection Error");
    });

    mongoose.connection.on("disconnected", () => {
      console.error("MongoDB disconnected. Reconnecting...");
      this.connect();
    });

    process.on("SIGINT", () => {
      this.closeConnection();
    });
  }

  // Method to establish connection to the database
  async connect() {
    try {
      await mongoose.connect(this.dbUri);
      console.log("Connected to MongoDB.");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    }
  }

  // Method to close the database connection gracefully
  closeConnection() {
    mongoose.connection.close(() => {
      console.log("MongoDB connection closed through app termination.");
      process.exit(0);
    });
  }
}

// Check if MongoDB URL is provided in the environment variables
const DBURI = process.env.MONGO_URL;
if (!DBURI) {
  console.error("MongoDB URL is missing.");
  process.exit(1);
}

// Create an instance of DatabaseConnector and establish the connection
const dbConnector = new DatabaseConnector(DBURI);
dbConnector.connect();

// Export the dbConnector instance for external use
module.exports = dbConnector;

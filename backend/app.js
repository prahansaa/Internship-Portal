const express = require("express");
require("dotenv").config();

// Create the Express app
const app = express();

// Import configurations and middleware
const connectDB = require("./config/database");
connectDB();
const setupMiddleware = require("./middleware");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// Import routes
const indexRoutes = require("./routes/index");
const userRoutes = require("./routes/userroutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const seedRoutes = require("./routes/seed");
const googleAuthRoutes = require("./routes/googleAuth");


// Setup middleware
setupMiddleware(app);

// API routes
app.use("/api", indexRoutes);
app.use("/api/users", userRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api", seedRoutes);
app.use("/api", googleAuthRoutes);

// Legacy routes for backward compatibility
app.use("/", userRoutes); // Legacy routes without /api prefix
app.use("/", jobRoutes); // Legacy internship routes

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || "development"}`);
});
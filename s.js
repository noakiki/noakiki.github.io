const express = require("express");
const morgan = require("morgan");
const winston = require("winston");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Winston Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "app.log" }),
  ],
});

// Middleware: Morgan for Request Logs
app.use(morgan("dev", { stream: { write: (msg) => logger.info(msg.trim()) } }));

// Serve Static Files
app.use(express.static(path.join(__dirname, "public")));

// API Route
app.get("/api", (req, res) => {
  logger.info("API endpoint accessed");
  res.json({ message: "Welcome to the API" });
});

// Logs Route
app.get("/logs", (req, res) => {
  res.sendFile(path.join(__dirname, "app.log"));
});

// Start Server
app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
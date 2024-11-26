const pool = require("./db");
const { mkdirSync, existsSync, appendFile } = require("node:fs");
const path = require("node:path");
const { EOL } = require("node:os");

module.exports = {
  loggerForDatabase: async (eventType, message) => {
    await pool.query(
      "INSERT INTO audit (event_type, message) VALUES ($1, $2)",
      [eventType, message],
    );
  },
  loggerForFileSystem: (eventType, message) => {
    const logDirectory = path.join(__dirname, "logs");
    const date = new Date();
    const dateString = date.toISOString().split("T")[0];
    const logFileName = `${dateString}.log`;
    const logFilePath = path.join(logDirectory, logFileName);

    if (!existsSync(logDirectory)) {
      mkdirSync(logDirectory);
    }

    const logEntry = `[${date.toISOString()}] [${eventType.toUpperCase()}] ${message}${EOL}`;

    appendFile(logFilePath, logEntry, (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    });
  },
  loggerForStatsD: (eventType, message) => {
    return 1;
  },
};

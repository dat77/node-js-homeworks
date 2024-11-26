const express = require("express");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const tweetRoutes = require("./routes/tweets");
const bodyParser = require("body-parser");
const cors = require("cors");
const pool = require("./db");
const { datadogRum } = require("@datadog/browser-rum");

const app = express();

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL");
  })
  .catch((err) => {
    console.error("Database connection error:", err.stack);
  });
try {
  datadogRum.init({
    applicationId: "3bd9c149-6b62-47da-a368-5774aa4a1887",
    clientToken: "pub05b426932df0e63b369ffd7b9af8c299",
    service: "test-application",
    env: "<ENV_NAME>",
    trackUserInteractions: true,
    trackResources: true,
    defaultPrivacyLevel: "mask-user-input",
  });

  console.log("Datadog RUM initialized successfully");
  const renderingError = new Error("Some error occurred");
  renderingError.name = `ReactRenderingError`;

  datadogRum.addError(renderingError);
} catch (error) {
  console.error("Failed to initialize Datadog RUM:", error);
  throw new Error("Datadog RUM initialization failed");
}
app.use(bodyParser.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/tweets", tweetRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

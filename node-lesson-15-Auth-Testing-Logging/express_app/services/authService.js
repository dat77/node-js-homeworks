const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { loggerForDatabase, loggerForFileSystem } = require("../logs");

exports.register = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (await User.exists(username)) {
      const message = `Registration attempt with existing username: ${username}`;
      await loggerForDatabase("warning", message);
      loggerForFileSystem("warning", message);
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword });

    const message = `User registered: ${username}`;
    await loggerForDatabase("success", message);
    loggerForFileSystem("success", message);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    const message = `Registration error: ${error.message}`;
    await loggerForDatabase("error", message);
    loggerForFileSystem("error", message);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) {
      console.error("Error logging user");
      const message = `Login attempt with invalid username: ${username}`;
      await loggerForDatabase("warning", message);
      loggerForFileSystem("warning", message);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const message = `Login attempt with invalid password for username: ${username}`;
      await loggerForDatabase("warning", message);
      loggerForFileSystem("warning", message);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ username }, "secretKey", { expiresIn: "1h" });
    const message = `User logged in: ${username}`;
    await loggerForDatabase("success", message);
    loggerForFileSystem("success", message);
    res.json({ token });
  } catch (error) {
    const message = `Login error: ${error.message}`;
    await loggerForDatabase("error", message);
    await loggerForStatsD("error", message);
    loggerForFileSystem("error", message);
    res.status(500).json({ message: "Login failed" });
  }
};

exports.someRecursiveFunction = async (req, res) => {
  const r = (counter) => {
    r(counter + 1);
  };

  r(req.body.counter);
  return 1;
};

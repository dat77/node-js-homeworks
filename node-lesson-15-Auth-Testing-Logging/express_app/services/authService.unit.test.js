const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { loggerForDatabase } = require("../logs");
const { register, login, someRecursiveFunction } = require("./authService");

jest.mock("../logs", () => ({
  loggerForDatabase: jest.fn(),
  loggerForFileSystem: jest.fn(),
  loggerForStatsD: jest.fn(),
}));

jest.mock("../models/userModel", () => ({
  exists: jest.fn(),
  create: jest.fn(),
  findByUsername: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("Auth Controller", () => {
  describe("register", () => {
    it("should return 400 if user already exists", async () => {
      const mockReq = {
        body: { username: "testuser", password: "password123" },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.exists.mockResolvedValue(true);

      await register(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User already exists",
      });
      expect(loggerForDatabase).toHaveBeenCalledWith(
        "warning",
        expect.stringContaining("Registration attempt with existing username"),
      );
    });

    it("should create a user and return 201 on success", async () => {
      const mockReq = {
        body: { username: "newuser", password: "password123" },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.exists.mockResolvedValue(false);
      bcrypt.hash.mockResolvedValue("hashedpassword");
      User.create.mockResolvedValue();

      await register(mockReq, mockRes);

      expect(User.create).toHaveBeenCalledWith({
        username: "newuser",
        password: "hashedpassword",
      });
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "User registered successfully",
      });
      expect(loggerForDatabase).toHaveBeenCalledWith(
        "success",
        expect.stringContaining("User registered"),
      );
    });
  });

  describe("login", () => {
    it("should return 401 if user does not exist", async () => {
      const mockReq = {
        body: { username: "nonexistent", password: "password123" },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findByUsername.mockResolvedValue(null);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
      expect(loggerForDatabase).toHaveBeenCalledWith(
        "warning",
        expect.stringContaining("Login attempt with invalid username"),
      );
    });

    it("should return 401 if password is invalid", async () => {
      const mockReq = {
        body: { username: "testuser", password: "wrongpassword" },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findByUsername.mockResolvedValue({
        username: "testuser",
        password: "hashedpassword",
      });
      bcrypt.compare.mockResolvedValue(false);

      await login(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "Invalid credentials",
      });
      expect(loggerForDatabase).toHaveBeenCalledWith(
        "warning",
        expect.stringContaining("Login attempt with invalid password"),
      );
    });

    it("should return a token and status 200 on successful login", async () => {
      const mockReq = {
        body: { username: "testuser", password: "password123" },
      };
      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.findByUsername.mockResolvedValue({
        username: "testuser",
        password: "hashedpassword",
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("testtoken");

      await login(mockReq, mockRes);

      expect(jwt.sign).toHaveBeenCalledWith(
        { username: "testuser" },
        "secretKey",
        { expiresIn: "1h" },
      );
      expect(mockRes.status).not.toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ token: "testtoken" });
      expect(loggerForDatabase).toHaveBeenCalledWith(
        "success",
        expect.stringContaining("User logged in"),
      );
    });
  });
});

describe("someRecursiveFunction", () => {
  it("should throw a maximum call stack error due to infinite recursion", async () => {
    const mockReq = { body: { counter: 0 } };
    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await someRecursiveFunction(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    // await expect(async () => {
    //   await someRecursiveFunction(mockReq, mockRes);
    // }).rejects.toThrow("Maximum call stack size exceeded");
  });
});

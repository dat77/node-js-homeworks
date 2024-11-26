const request = require("supertest");
const app = require("../index");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

jest.mock("../models/userModel");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock();

describe("Integration tests for Auth Controller", () => {
  describe("POST /register", () => {
    it("should register a new user successfully", async () => {
      User.exists.mockResolvedValue(false);
      bcrypt.hash.mockResolvedValue("hashedpassword");
      User.create.mockResolvedValue();

      const response = await request(app)
        .post("/auth/register")
        .send({ username: "testuser", password: "password123" });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully");
      expect(User.exists).toHaveBeenCalledWith("testuser");
      expect(User.create).toHaveBeenCalledWith({
        username: "testuser",
        password: "hashedpassword",
      });
    });

    it("should return 400 if user already exists", async () => {
      User.exists.mockResolvedValue(true);

      const response = await request(app)
        .post("/auth/register")
        .send({ username: "testuser", password: "password123" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("User already exists");
    });
  });

  describe("POST /login", () => {
    it("should login successfully and return a token", async () => {
      const mockUser = { username: "testuser", password: "hashedpassword" };
      User.findByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("testtoken");

      const response = await request(app)
        .post("/auth/login")
        .send({ username: "testuser", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body.token).toBe("testtoken");
      expect(User.findByUsername).toHaveBeenCalledWith("testuser");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedpassword",
      );
    });

    it("should return 401 for invalid credentials", async () => {
      User.findByUsername.mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/login")
        .send({ username: "nonexistentuser", password: "password123" });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });
  });
});

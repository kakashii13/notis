import { app } from "../app";
import supertest from "supertest";
import User from "../models/user";
import mongoose from "mongoose";
import { EncryptionService } from "../services/encryptionService";

beforeAll(async () => {
  const hashPassword = await EncryptionService.encryptPassword("test");
  await User.create({
    username: "testLogin",
    hash_password: hashPassword,
    email: "testLogin@test.com",
  });
});

describe("POST /api/login", () => {
  it("should return 200 OK", async () => {
    const response = await supertest(app).post("/api/login").send({
      username: "testLogin",
      password: "test",
    });

    expect(response.status).toBe(200);
  });
  it("should return 400 if user doesn't exist", async () => {
    const response = await supertest(app).post("/api/login").send({
      username: "usernoexist",
      password: "test",
    });

    expect(response.status).toBe(400);
  });
  it("should return 404 if don't received all fields", async () => {
    const response = await supertest(app).post("/api/login").send({
      username: "",
      password: "",
    });

    expect(response.status).toBe(404);
  });
});

afterAll(async () => {
  await User.deleteOne({ username: "testLogin" });
  await mongoose.disconnect();
});

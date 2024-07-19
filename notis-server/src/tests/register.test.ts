import { app } from "../app";
import supertest from "supertest";
import User from "../models/user";
import mongoose from "mongoose";

beforeAll(async () => {
  await User.deleteMany();
});

describe("POST /api/signup", () => {
  it("should throw an error if user isn't provided", async () => {
    const response = await supertest(app).post("/api/signup").send();

    // Verificar codigo de respuesta
    const responseParsed = JSON.parse(response.text);
    expect(responseParsed.status).toBe(404);
    expect(responseParsed.message.error).toBe("You must complete all fields.");
  });
  it("should throw an error if are an empty string", async () => {
    const response = await supertest(app).post("/api/signup").send({
      username: "",
      password: "",
      email: "",
    });

    // Verificar codigo de respuesta
    const responseParsed = JSON.parse(response.text);
    expect(responseParsed.status).toBe(404);
    expect(responseParsed.message.error).toBe("You must complete all fields.");
  });
  it("should return a new user", async () => {
    const response = await supertest(app).post("/api/signup").send({
      username: "test1",
      password: "test1",
      email: "test@test.com",
    });

    expect(response.status).toBe(201);
  });
});

afterAll(async () => {
  await mongoose.disconnect();
});

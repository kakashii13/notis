import { app } from "../app";
import supertest from "supertest";
import User from "../models/user";
import { EncryptionService } from "../services/encryptionService";
import mongoose from "mongoose";
import Note from "../models/note";
import { IUser } from "../utils/interfaces";

let userCreated: IUser | undefined = undefined;

beforeAll(async () => {
  await Note.deleteMany();
  const hashPassword = await EncryptionService.encryptPassword("test");
  userCreated = await User.create({
    username: "testLogin",
    hash_password: hashPassword,
    email: "testLogin@test.com",
  });
});

describe("note endpoints", () => {
  describe("POST /api/note", () => {
    it("should return 201 if note is created", async () => {
      const response = await supertest(app)
        .post("/api/note")
        .send({
          user: { username: "testLogin" },
          note: { title: "Example note", body: "Body a test note" },
        });

      expect(response.status).toBe(201);
    });

    it("should return 400 if note fields doesn't exist or are empty", async () => {
      const response = await supertest(app).post("/api/note").send({
        user: {},
        note: {},
      });

      expect(response.status).toBe(400);
    });

    it("should return 400 if user doesn't exist", async () => {
      const response = await supertest(app)
        .post("/api/note")
        .send({
          user: { username: "userdoesntexist" },
          note: { title: "" },
        });

      expect(response.status).toBe(400);
    });
  });
  describe("GET /api/note", () => {
    it("should return 200 if note is found", async () => {
      // user id doesn't exist, is only for test
      const noteCreated = await Note.create({
        title: "Title test",
        body: "",
        pin: false,
        user: userCreated?._id,
      });
      const castNoteID = noteCreated._id.toString();
      const response = await supertest(app).get(`/api/note/${castNoteID}`);

      expect(response.status).toBe(200);
    });
  });
});

afterAll(async () => {
  await User.deleteOne({ username: "testLogin" });
  await mongoose.disconnect();
});

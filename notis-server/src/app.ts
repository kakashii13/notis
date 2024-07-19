import express from "express";
const app = express();

import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";

import { errorManager } from "./middlewares/errorsMiddleware";

import dotenv from "dotenv";
dotenv.config();

// import routes
import userRouter from "./routes/userRoute";
import noteRouter from "./routes/noteRoute";
import tagRouter from "./routes/tagRoute";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("short"));

try {
  (async () => {
    await mongoose.connect(process.env.MONGO_URL || "");
    console.log("Mongo DB connected successfully");
  })();
} catch (error) {
  console.log(error);
}

app.use("/api", userRouter);
app.use("/api", noteRouter);
app.use("/api", tagRouter);

app.use(errorManager);

export { app };

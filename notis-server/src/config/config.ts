import dotenv from "dotenv";

dotenv.config();

export const config = {
  jwtPrivateKey: process.env.JWT_PRIVATE_KEY || "",
};

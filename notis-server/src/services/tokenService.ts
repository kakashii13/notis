import { JwtPayload, sign, verify } from "jsonwebtoken";
import { config } from "../config/config";
import { IPayloadJWT } from "../utils/interfaces";
import { Request } from "express";
import { HttpException } from "../errors/httpExceptionService";

export class TokenService {
  static createToken(payload: IPayloadJWT): string {
    try {
      const token = sign(payload, config.jwtPrivateKey, {
        expiresIn: "2 days",
      });
      return token;
    } catch (error) {
      throw error;
    }
  }

  static validateToken(req: Request): string | JwtPayload {
    try {
      const token: string | null = this.extractToken(req);
      if (!token) throw new HttpException(400, { error: "Missing token." });

      // if there are token, verify
      const tokenVerify = verify(token, config.jwtPrivateKey);

      if (!tokenVerify)
        throw new HttpException(400, { error: "Incorrect token." });

      return tokenVerify;
    } catch (error) {
      throw error;
    }
  }
  static extractToken(req: Request) {
    // Get the token from the request header
    const auth = req.get("Authorization");
    // Check if the token is valid
    // And start with "Bearer"
    if (auth && auth.toLocaleLowerCase().startsWith("bearer ")) {
      // get and return only the token
      return auth.substring(7);
    }

    return null;
  }
}

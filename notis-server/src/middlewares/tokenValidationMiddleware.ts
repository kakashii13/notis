import { NextFunction, Response } from "express";
import { TokenService } from "../services/tokenService";
import { IToken, RequestCustom } from "../utils/interfaces";

export class TokenValidationMiddleware {
  // this middleware validate the token using the TokenService
  static tokenValidation(
    req: RequestCustom,
    res: Response,
    next: NextFunction
  ): void {
    try {
      const token: IToken = TokenService.validateToken(req) as IToken;
      req.token = token;
      next();
    } catch (error) {
      next(error);
    }
  }
}

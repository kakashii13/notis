import { NextFunction, Request, Response } from "express";
import { HttpException } from "../errors/httpExceptionService";

export class AuthValidationMiddleware {
  static registerValidation(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    try {
      const { username, password, email }: any = req.body;

      if (
        !password ||
        !password?.length ||
        !username ||
        !username?.length ||
        !email ||
        !email?.length
      )
        throw new HttpException(404, "You must complete all fields.");

      req.body = { username, password, email };
      next();
    } catch (error) {
      throw error;
    }
  }

  static loginValidation(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    try {
      const { username, password }: any = req.body;

      if (!password || !password?.length || !username || !username?.length)
        throw new HttpException(404, "You must complete all fields.");

      req.body = { username, password };
      next();
    } catch (error) {
      throw error;
    }
  }
}

import { NextFunction, Response } from "express";
import { IToken, RequestCustom } from "../utils/interfaces";
import { HttpException } from "../errors/httpExceptionService";

export class RequestOwnershipValidation {
  static validateRequestOwnership(
    req: RequestCustom,
    res: Response,
    next: NextFunction
  ) {
    try {
      // received token already validated
      // is an object with the property username
      const token: IToken = req.token as IToken;
      // user can be pass through body or params
      // user is an object with the property username
      // username is a string
      const { user } = req.body;
      const { username } = req.params;

      const userToCompare = user?.username || username;

      if (userToCompare != token?.username)
        throw new HttpException(401, "Unauthorized");

      next();
    } catch (error) {
      next(error);
    }
  }
}

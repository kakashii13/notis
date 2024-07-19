import { NextFunction, Request, Response } from "express";
import { HttpException } from "../errors/httpExceptionService";
import { UserService } from "../services/userService";

export class UserValidationMiddleware {
  static async userValidation(req: Request, res: Response, next: NextFunction) {
    try {
      // user can be pass through body or params
      const { user } = req.body;
      const { username } = req.params;

      if ((!user || !user.username) && !username) {
        throw new HttpException(400, "Username is required.");
      }

      const userToSearch: string = user?.username || username;

      const userExist = await UserService.getUserPlain(userToSearch);

      if (!userExist) {
        throw new HttpException(404, "User doesn't exist.");
      }

      next();
    } catch (error) {
      next(error);
    }
  }
}

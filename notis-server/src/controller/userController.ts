import { NextFunction, Request, Response } from "express";
import { IUser } from "../utils/interfaces";
import { UserService } from "../services/userService";
import { DocumentTransform } from "../services/documentTransform";

export class UserController {
  static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user: IUser = req.body;

      // create user
      // return token string and user object
      const { token, newUser } = await UserService.createUser(user);

      res.status(201).send({
        message: "User created successfully.",
        data: {
          user: newUser,
          token,
        },
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  }

  static async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.body;
      // login user
      // return token string and user object
      const { token, userToClient } = await UserService.loginUser(user);

      res.status(200).send({
        message: "User successfully loggen in.",
        data: {
          user: userToClient,
          token,
        },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  // A esta fn falta agregarle el token
  static async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId }: { userId: string } = req.body;
      await UserService.deleteUser(userId);
      res.status(200).send({
        message: `User id: ${userId} has been deleted.`,
        data: {},
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserByUsername(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { username } = req.params;

      const userFound = await UserService.getUserPlain(username);

      res.status(200).send({
        message: "User found.",
        data: {
          userFound: DocumentTransform.transformUserResponse(
            userFound as IUser
          ),
        },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.params;
      // user data to update
      const { password } = req.body;

      const userUpdated = await UserService.updateUser(username, { password });

      res.status(200).send({
        message: "User updated successfully.",
        data: {
          user: userUpdated,
        },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }
}

import { NextFunction, Request, Response, Router } from "express";
import { UserController } from "../controller/userController";
import { AuthValidationMiddleware } from "../middlewares/authValidationMiddleware";
import { UserValidationMiddleware } from "../middlewares/userValidationMiddleware";
import { TokenValidationMiddleware } from "../middlewares/tokenValidationMiddleware";
import { RequestOwnershipValidation } from "../middlewares/requestOwnershipMiddleware";

const userRouter = Router();

userRouter.post(
  "/signup",
  AuthValidationMiddleware.registerValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    await UserController.createUser(req, res, next);
  }
);

userRouter.post(
  "/login",
  AuthValidationMiddleware.loginValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    await UserController.loginUser(req, res, next);
  }
);

userRouter.get(
  "/user/:username",
  UserValidationMiddleware.userValidation,
  TokenValidationMiddleware.tokenValidation,
  RequestOwnershipValidation.validateRequestOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    await UserController.getUserByUsername(req, res, next);
  }
);

userRouter.put(
  "/user/update/:username",
  UserValidationMiddleware.userValidation,
  TokenValidationMiddleware.tokenValidation,
  RequestOwnershipValidation.validateRequestOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    await UserController.updateUser(req, res, next);
  }
);

// move all notes to trash
userRouter.delete(
  "/user/notes/:username",
  async (req: Request, res: Response, next: NextFunction) => {
    //
  }
);

// this function is not finished
userRouter.delete(
  "/user",
  async (req: Request, res: Response, next: NextFunction) => {
    await UserController.deleteUser(req, res, next);
  }
);

export default userRouter;

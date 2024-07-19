import { NextFunction, Request, Response, Router } from "express";
import { TagController } from "../controller/tagController";
import { UserValidationMiddleware } from "../middlewares/userValidationMiddleware";
import { TokenValidationMiddleware } from "../middlewares/tokenValidationMiddleware";
import { RequestOwnershipValidation } from "../middlewares/requestOwnershipMiddleware";
import { TagValidationMiddleware } from "../middlewares/tagValidationMiddleware";

const TagRouter = Router();

TagRouter.post(
  "/tag",
  UserValidationMiddleware.userValidation,
  TokenValidationMiddleware.tokenValidation,
  RequestOwnershipValidation.validateRequestOwnership,
  TagValidationMiddleware.tagValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    await TagController.createTag(req, res, next);
  }
);

TagRouter.get(
  "/tags",
  UserValidationMiddleware.userValidation,
  TokenValidationMiddleware.tokenValidation,
  RequestOwnershipValidation.validateRequestOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    await TagController.getTags(req, res, next);
  }
);

TagRouter.delete(
  "/tag/:id",
  UserValidationMiddleware.userValidation,
  TokenValidationMiddleware.tokenValidation,
  RequestOwnershipValidation.validateRequestOwnership,
  TagValidationMiddleware.existTagGiven,
  async (req: Request, res: Response, next: NextFunction) => {
    await TagController.deleteTag(req, res, next);
  }
);

export default TagRouter;

import { NextFunction, Request, Response } from "express";
import { HttpException } from "../errors/httpExceptionService";
import { TagService } from "../services/tagService";

export class TagValidationMiddleware {
  static async tagValidation(req: Request, res: Response, next: NextFunction) {
    try {
      const { tagName } = req.body;

      if (!tagName || tagName == "") {
        throw new HttpException(400, "Tag name is required.");
      }

      next();
    } catch (error) {
      next(error);
    }
  }

  static async existTagGiven(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (!id) throw new HttpException(400, "Id is required.");

      if (!(await TagService.ExistTag(id)))
        throw new HttpException(400, "The tag given doesn't exist.");

      next();
    } catch (error) {
      next(error);
    }
  }
}

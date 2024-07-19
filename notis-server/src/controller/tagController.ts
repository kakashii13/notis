import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { ITag, IUser } from "../utils/interfaces";
import { TagService } from "../services/tagService";

export class TagController {
  static async createTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { user, tagName }: { user: IUser; tagName: string } = req.body;
      const userFound = (await User.findOne({
        username: user.username,
      })) as IUser;

      const newTag = (await TagService.CreateTag(userFound, tagName)) as ITag;

      res.status(200).send({
        message: "Tag created successfully.",
        data: {
          newTag,
        },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTags(req: Request, res: Response, next: NextFunction) {
    try {
      const { user }: { user: IUser } = req.body;
      const userFound = (await User.findOne({
        username: user.username,
      })) as IUser;
      const userTags = await TagService.GetTags(userFound);

      res.status(200).send({
        message: "User tags",
        data: {
          userTags,
        },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await TagService.DeleteTag(id);

      res.status(200).send({
        message: "Tag was deleted successfully.",
        data: {},
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }
}

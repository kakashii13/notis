import { HttpException } from "../errors/httpExceptionService";
import { ITag, IUser } from "../utils/interfaces";
import Tag from "../models/tag";

export class TagService {
  static async CreateTag(user: IUser, name: string): Promise<ITag> {
    try {
      const newTag: ITag = await Tag.create({
        tagName: name.toLowerCase(),
        user: user._id,
      });
      if (!newTag)
        throw new HttpException(400, "It was not possible create the tag.");
      return newTag;
    } catch (error) {
      throw error;
    }
  }
  static async GetTags(user: IUser): Promise<ITag[]> {
    try {
      const arrTags: ITag[] = await Tag.find({ user: user._id });
      return arrTags;
    } catch (error) {
      throw error;
    }
  }

  static async ExistTag(tagID: string): Promise<boolean> {
    try {
      console.log("TAG ID ->", tagID);
      const exist = await Tag.findById(tagID);

      if (exist) return true;
      else return false;
    } catch (error) {
      throw error;
    }
  }

  static async DeleteTag(tagID: string): Promise<void> {
    try {
      if (!(await Tag.findByIdAndDelete(tagID)))
        throw new HttpException(400, "It was not possible delete the tag.");
    } catch (error) {
      throw error;
    }
  }
}

import { IUser } from "../utils/interfaces";

export class DocumentTransform {
  static transformUserResponse(user: IUser): IUser {
    user.id = user._id;
    delete user.__v;
    delete user._id;
    delete user.hash_password;

    return user;
  }
}

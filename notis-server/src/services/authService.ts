import User from "../models/user";
import { compare } from "bcrypt";
import { UserService } from "./userService";
import { EncryptionService } from "./encryptionService";
import { HttpException } from "../errors/httpExceptionService";
import { IUser } from "../utils/interfaces";

export class Authentication {
  static async register(data: IUser): Promise<unknown | typeof User> {
    try {
      if (await UserService.getUserPlain(data.username, data?.email)) {
        throw new HttpException(400, "User already exist");
      }

      // encrypt password
      const hashPassword = await EncryptionService.encryptPassword(
        data?.password ?? ""
      );

      // user object
      const user = {
        username: data?.username,
        hash_password: hashPassword,
        email: data?.email,
        profile_picture: null,
      };

      return await User.create(user);
    } catch (error) {
      throw error;
    }
  }

  // received {username, password}
  static async login(data: IUser): Promise<IUser> {
    try {
      const userExist: any = await UserService.getUserPlain(data.username);

      if (!userExist) {
        throw new HttpException(400, "User doesn't exist.");
      }

      const isTheSamePassword =
        (await compare(data.password ?? "", userExist.hash_password)) ?? false;

      if (!isTheSamePassword)
        throw new HttpException(400, "Incorrect password.");

      return userExist as IUser;
    } catch (error) {
      throw error;
    }
  }
}

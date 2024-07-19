import User from "../models/user";
import { HttpException } from "../errors/httpExceptionService";
import { IPayloadJWT, IUser } from "../utils/interfaces";
import { Authentication } from "./authService";
import { TokenService } from "./tokenService";
import { EncryptionService } from "./encryptionService";

export class UserService {
  static async createUser(user: IUser) {
    try {
      // create new user
      const newUser: typeof User | unknown = await Authentication.register(
        user
      );

      const payloadForToken: IPayloadJWT = {
        username: user.username,
        email: user.email || "",
      };

      // create token
      const token = TokenService.createToken(payloadForToken);
      return { newUser, token };
    } catch (error) {
      throw error;
    }
  }
  static async deleteUser(userId: string) {
    try {
      // delete user
    } catch (error) {
      throw error;
    }
  }
  static async updateUser(
    username: string,
    dataToUpdate: { password: string }
  ) {
    try {
      // encrypt password
      const hashPassword = await EncryptionService.encryptPassword(
        dataToUpdate.password
      );

      // first i will update only the password, later the profile picture
      const userUpdated = await User.findOneAndUpdate(
        { username },
        { hash_password: hashPassword },
        { new: true }
      ).lean();

      return userUpdated as IUser;
    } catch (error) {
      throw error;
    }
  }
  static async getUserPlain(
    username: string | null,
    email?: string | null,
    userID?: string | null
  ): Promise<IUser | null> {
    try {
      let query: any = {};
      if (username && email) {
        query = { $or: [{ username }, { email }] };
      } else if (username) {
        query = { username };
      } else if (email) {
        query = { email };
      } else if (userID) {
        query = { _id: userID };
      }
      const userExist = await User.findOne(query).lean();

      return userExist as IUser;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async getUser(user: IUser): Promise<IUser | null> {
    try {
      // get user from db
      const userDB = await User.findOne({ username: user.username });
      return userDB;
    } catch (error) {
      throw error;
    }
  }
  static async loginUser(user: IUser) {
    try {
      // login return user authenticated or throw an error
      // user type of User model
      const loginUser = await Authentication.login(user);
      /*
       LoginUser example return => 
        {
          _id: new ObjectId('1829371892'),
          username: 'test',
          email: 'test@test.com',
          profile_picture: null,
          hash_password: '$2b$10$OXfb2QQ2JL2yO./yV//S.YFCzgR3LXKYSgdozF2rRvyUHJEoNSIW',
          createdAt: 2023-01-13T23:46:07.778Z,
          updatedAt: 2024-05-13T23:46:07.778Z,
          __v: 0
        }
      */

      const payloadForToken: IPayloadJWT = {
        username: loginUser.username,
        email: loginUser.email || "",
      };

      // create token
      const token = TokenService.createToken(payloadForToken);

      // cast to return a user to client
      const userToClient = {
        id: loginUser._id?.toString(),
        username: loginUser.username,
        email: loginUser.email,
        profile_picture: loginUser.profile_picture,
        createdAt: loginUser.createdAt,
        updatedAt: loginUser.updatedAt,
      };

      return { userToClient, token };
    } catch (error) {
      throw error;
    }
  }
}

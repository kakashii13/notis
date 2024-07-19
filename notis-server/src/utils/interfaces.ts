import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Document, ObjectId, Timestamp } from "mongodb";

export interface IPayloadJWT {
  username: string;
  email: string;
}

export interface IUser extends Document {
  _id?: ObjectId;
  id?: string | ObjectId;
  username: string;
  email?: string;
  hash_password?: string;
  password?: string;
  profile_picture?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  __v?: number;
  notes?: object[] | null;
  deleted_notes?: object[] | null;
}

export interface INote extends Document {
  _id?: ObjectId;
  id?: string;
  title?: string;
  body?: string;
  pin?: boolean;
  user?: {} | null;
  trash?: boolean;
  tags?: string[] | null;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface RequestCustom extends Request {
  token?: string | null | JwtPayload;
}

export interface IToken {
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export interface INoteDeleted extends Document {
  _id?: ObjectId;
  id?: string | ObjectId;
  user_id: string;
  note_id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ITag extends Document {
  _id?: ObjectId;
  id?: string | ObjectId;
  user: string | ObjectId;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

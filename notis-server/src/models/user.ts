import mongoose, { Model } from "mongoose";
import { IUser } from "../utils/interfaces";
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    profile_picture: String || null,
    hash_password: { type: String, required: true },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  transform: (doc, rto) => {
    rto.id = rto._id;
    delete rto._id;
    delete rto.hash_password;
    delete rto.__v;
  },
});
const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;

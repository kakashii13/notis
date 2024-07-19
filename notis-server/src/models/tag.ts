import mongoose, { Model } from "mongoose";
import { ITag } from "../utils/interfaces";

const TagSchema = new mongoose.Schema(
  {
    tagName: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

TagSchema.set("toJSON", {
  transform: (doc, rto) => {
    rto.id = rto._id;
    delete rto._id;
    delete rto.__v;
  },
});

const Tag: Model<ITag> = mongoose.model<ITag>("Tag", TagSchema);

export default Tag;

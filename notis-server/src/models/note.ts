import mongoose, { Model } from "mongoose";
import { INote } from "../utils/interfaces";

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    body: { type: String },
    pin: { type: Boolean },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    trash: { type: Boolean },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  },
  {
    timestamps: true,
  }
);

NoteSchema.set("toJSON", {
  transform: (doc, rto) => {
    (rto.id = rto._id), delete rto._id, delete rto.__v;
  },
});

const Note: Model<INote> = mongoose.model<INote>("Note", NoteSchema);

export default Note;

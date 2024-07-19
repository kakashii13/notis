import Note from "../models/note";
import { HttpException } from "../errors/httpExceptionService";
import { INote, ITag, IUser } from "../utils/interfaces";
import { UserService } from "./userService";
import mongoose from "mongoose";

export class NoteService {
  static async createNote(note: INote, user: IUser): Promise<INote> {
    try {
      // Check if user exist in db
      const userSearched = (await UserService.getUser(user)) as IUser;
      // Assign user id to note object

      (note.pin = false), (note.trash = false), (note.user = userSearched?._id);

      // Create a new note
      const newNote: INote = await Note.create(note);

      if (!newNote) {
        throw new HttpException(400, {
          error: "It was not possible create the note.",
        });
      }
      return newNote;
    } catch (error) {
      throw error;
    }
  }
  static async updateNote(note: INote): Promise<INote> {
    try {
      const query: INote = {};

      console.log("DATA OF NOTE TO UPDATE-> ", note);
      if (note.title) query.title = note.title;
      if (note.body) query.body = note.body;
      if (note.pin) query.pin = note.pin;
      if (note.tags) query.tags = note.tags;

      const noteToUpdate = await Note.findOneAndUpdate(
        { _id: note?.id },
        { $set: query },
        { new: true }
      );

      if (!noteToUpdate) {
        throw new HttpException(400, "It was not possible update the note.");
      }

      await noteToUpdate?.save();
      return noteToUpdate as INote;
    } catch (error) {
      throw error;
    }
  }

  // switch note into trash
  static async toggleTrash(note_id: string): Promise<boolean> {
    try {
      const noteSearched = (await Note.findById(note_id)) as INote;
      if (!noteSearched)
        throw new HttpException(400, "Error to search the note.");

      noteSearched.trash = !noteSearched.trash;
      await noteSearched?.save();
      return noteSearched.trash;
    } catch (error) {
      throw error;
    }
  }

  static async deleteNote(note_id: string): Promise<void> {
    try {
      const noteToDelete = await Note.deleteOne({ _id: note_id });
      if (!noteToDelete)
        throw new HttpException(400, "Error to delete the note");
    } catch (error) {
      throw error;
    }
  }
  static async getNote(note_id: string) {
    try {
      const noteSearched = await Note.findById(note_id);

      if (!noteSearched) throw new HttpException(404, "Note doesn't exist.");
      return noteSearched;
    } catch (error) {
      throw error;
    }
  }
  static async getNotes(userID: string): Promise<INote[] | null> {
    try {
      const notes = await Note.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(userID) } },
        {
          $lookup: {
            from: "tags",
            localField: "tags",
            foreignField: "_id",
            as: "tags",
          },
        },
      ]);

      return notes as INote[] | null;
    } catch (error) {
      throw error;
    }
  }

  static async getNotesByTag(tagID: string): Promise<ITag[]> {
    try {
      const notes = (await Note.aggregate([
        {
          $match: {
            tags: new mongoose.Types.ObjectId(tagID),
          },
        },
      ])) as ITag[];

      return notes;
    } catch (error) {
      throw error;
    }
  }

  static async NoteExist(noteID: string): Promise<boolean> {
    try {
      const isNote = (await Note.findById(noteID)) as INote;
      if (isNote) return true;
      else return false;
    } catch (error) {
      throw error;
    }
  }
}

import { NextFunction, Request, Response } from "express";
import { INote, IUser } from "../utils/interfaces";
import { NoteService } from "../services/noteService";
import { TagService } from "../services/tagService";
import { HttpException } from "../errors/httpExceptionService";
import User from "../models/user";

export class NoteController {
  static async createNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { note, user }: { note: INote; user: IUser } = req.body;

      // validate if tags of note.tags exist.
      // if at least one tag doesn't exist, the server response an error
      if (note.tags && note.tags.length > 0) {
        let validation: boolean = true;
        for (const tagID of note.tags) {
          if (validation) {
            // check if given tag exist
            const response = await TagService.ExistTag(tagID);
            // if not, throw error
            if (!response) {
              validation = false;
              throw new HttpException(400, {
                error: "All tag should be exist.",
              });
            }
          }
        }
      }

      // create note
      const newNote = await NoteService.createNote(note, user);

      res.status(201).send({
        message: "Note created successfully.",
        data: { newNote },
        status: 201,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const note: INote = await NoteService.getNote(id);

      res.status(200).send({
        message: "Note found.",
        data: {
          note,
        },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNotes(req: Request, res: Response, next: NextFunction) {
    try {
      const { user } = req.body;
      const userDb = (await User.findOne({ username: user.username })) as IUser;
      const notes = (await NoteService.getNotes(
        userDb._id?.toString() || ""
      )) as INote[];

      res.status(200).send({
        message: "Notes of user.",
        data: {
          notes,
        },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNotesByTag(req: Request, res: Response, next: NextFunction) {
    try {
      const { tag }: { tag: string } = req.body;
      if (!tag) {
        throw new HttpException(400, "Tag field is empty.");
      }
      const notes = (await NoteService.getNotesByTag(tag)) as INote[];

      res.status(200).send({
        message: "Notes of user by tag.",
        data: {
          notes,
        },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }

  // toggle note to trash
  static async toggleTrash(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const move: boolean = await NoteService.toggleTrash(id as string);
      const message = move
        ? "It has been removed from your notes and send to trash."
        : "The note has been restored.";
      res.status(200).send({
        message,
        data: {},
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }
  // can update title, body, pin, tags
  static async updateNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { note }: { note: INote } = req.body;

      const noteUpdated = (await NoteService.updateNote(note)) as INote;

      res.status(200).send({
        message: "Note updated.",
        data: {
          noteUpdated,
        },
        status: 200,
      });
    } catch (error) {
      next(error);
    }
  }
}

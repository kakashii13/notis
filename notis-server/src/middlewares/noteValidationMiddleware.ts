import { NextFunction, Request, Response } from "express";
import { HttpException } from "../errors/httpExceptionService";
import { INote, IUser } from "../utils/interfaces";
import { NoteService } from "../services/noteService";

export class NoteValidationMiddleware {
  static noteValidation(req: Request, res: Response, next: NextFunction) {
    try {
      // user need only username
      // note is an object with only a title required
      const { note, user }: any = req.body;

      if (!note || !note.title?.length || !user || !user.username?.length) {
        throw new HttpException(400, "You must complete all fields.");
      }

      const noteToReq = {
        title: note.title,
        body: note.body || "",
        tags: note.tags || [],
      };

      (req.body.note = noteToReq),
        (req.body.user = { username: user.username });
      next();
    } catch (error) {
      throw error;
    }
  }

  static async noteExist(req: Request, res: Response, next: NextFunction) {
    try {
      // check if note was send
      const { note }: { note: INote; user: IUser } = req.body;

      if (!note || !note.id) {
        throw new HttpException(400, "Note should have an ID.");
      }
      const isNote = await NoteService.NoteExist(note.id || "");
      if (!isNote) {
        throw new HttpException(400, "Note doesn't exist.");
      }

      next();
    } catch (error) {
      throw error;
    }
  }
}

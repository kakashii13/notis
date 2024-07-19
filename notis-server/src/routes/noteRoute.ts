import { RequestOwnershipValidation } from "./../middlewares/requestOwnershipMiddleware";
import { NextFunction, Request, Response, Router } from "express";
import { NoteValidationMiddleware } from "../middlewares/noteValidationMiddleware";
import { NoteController } from "../controller/noteController";
import { TokenValidationMiddleware } from "../middlewares/tokenValidationMiddleware";
import { UserValidationMiddleware } from "../middlewares/userValidationMiddleware";

const NoteRouter = Router();

NoteRouter.post(
  "/note",
  UserValidationMiddleware.userValidation,
  NoteValidationMiddleware.noteValidation,
  TokenValidationMiddleware.tokenValidation,
  RequestOwnershipValidation.validateRequestOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    await NoteController.createNote(req, res, next);
  }
);

NoteRouter.get(
  "/note/:id",
  UserValidationMiddleware.userValidation,
  TokenValidationMiddleware.tokenValidation,
  RequestOwnershipValidation.validateRequestOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    await NoteController.getNote(req, res, next);
  }
);

NoteRouter.get(
  "/notes",
  UserValidationMiddleware.userValidation,
  TokenValidationMiddleware.tokenValidation,
  RequestOwnershipValidation.validateRequestOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    await NoteController.getNotes(req, res, next);
  }
);

// get note by tags
NoteRouter.get(
  "/notesByTag",
  UserValidationMiddleware.userValidation,
  TokenValidationMiddleware.tokenValidation,
  RequestOwnershipValidation.validateRequestOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    await NoteController.getNotesByTag(req, res, next);
  }
);

// toggle trash
NoteRouter.post(
  "/note/:id",
  UserValidationMiddleware.userValidation,
  TokenValidationMiddleware.tokenValidation,
  RequestOwnershipValidation.validateRequestOwnership,
  async (req: Request, res: Response, next: NextFunction) => {
    // this function move the note to trash
    await NoteController.toggleTrash(req, res, next);
  }
);

// update note
NoteRouter.put(
  "/note",
  UserValidationMiddleware.userValidation,
  TokenValidationMiddleware.tokenValidation,
  RequestOwnershipValidation.validateRequestOwnership,
  NoteValidationMiddleware.noteExist,
  async (req: Request, res: Response, next: NextFunction) => {
    await NoteController.updateNote(req, res, next);
  }
);

export default NoteRouter;

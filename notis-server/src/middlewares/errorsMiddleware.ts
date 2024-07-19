import { NextFunction, Request, Response } from "express";
import { HttpException } from "../errors/httpExceptionService";

export const errorManager = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = error.errorCode || 500;
  const message = error.message || "Internal server error";

  res.status(statusCode).send({
    status: statusCode,
    message,
  });
};

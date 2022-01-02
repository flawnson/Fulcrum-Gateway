import { PrismaClient } from '@prisma/client';
import { Session, SessionData } from "express-session";
import { Request, Response } from "express";

export interface Context {
  req: Request & {
    session: Session & Partial<SessionData> & {
      organizerId?: string,
      queueId?: string,
      userId?: string
    }},
  // res: Response
  // redis: typeof Redis
  prisma: PrismaClient;
}

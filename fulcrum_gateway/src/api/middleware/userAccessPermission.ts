// checks for proper permission to access user after authorization
import { MiddlewareFn } from "type-graphql";

import { Context } from "../context.interface";
import * as helpers from "../helpers";

export const userAccessPermission: MiddlewareFn<Context> = async ({ args, context }, next) => {
  // if accessed by organizer
  if (context.req.session.organizerId && args.userId){
    // check if user belongs in a queue that the organizer owns
    const exists = await helpers.userExistsInOrganizer(args.userId, context.req.session.organizerId);
    if (exists){
      return next();
    }
  }

  // if accessed by assistant
  if (context.req.session.queueId && args.userId){
    //check if user belongs to the queue
    const exists = await helpers.userExistsInQueue(args.userId, context.req.session.queueId);
    if (exists){
      return next();
    }
  }

  // if accessed by user
  if (context.req.session.userId){
    return next();
  }

  throw new Error("No permission to access user.");
};

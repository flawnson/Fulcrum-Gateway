// checks for proper permission to access queue after authorization
import { MiddlewareFn } from "type-graphql";

import { Context } from "../context.interface";
import * as helpers from "../helpers";
import { errors } from "../constants";

export const queueAccessPermission: MiddlewareFn<Context> = async ({ args, context }, next) => {
  // if accessed by organizer
  if (context.req.session.organizerId && args.queueId){
    // check if user belongs in a queue that the organizer owns
    const exists = await helpers.queueExistsInOrganizer(args.queueId, context.req.session.organizerId);
    if (exists){
      return next();
    }
  }

  // if accessed by ASSISTANT
  if (context.req.session.queueId){
    return next();
  }

  throw new Error(errors.CANNOT_ACCESS_QUEUE);
};

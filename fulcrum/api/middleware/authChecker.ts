import { AuthChecker } from "type-graphql";
import { Context } from "../context.interface";

// create auth checker function
export const authChecker: AuthChecker<Context> = ({ context: { req, prisma } }, roles) => {
  if (roles.length === 0) {
    // if `@Authorized()`, check only if ids exist in general
    return req.session.queueId !== undefined ||
      req.session.userId !== undefined ||
      req.session.organizerId !== undefined;
  }

  // Check roles
  if(req.session.organizerId){
    //check for permission as organizer
    if (roles.includes("ORGANIZER")){
      return true;
    }
  }

  if(req.session.queueId){
    //check for permission as assistant
    if (roles.includes("ASSISTANT")){
      return true;
    }
  }

  if(req.session.userId){
    //check for permission as user
    if (roles.includes("USER")){
      return true;
    }
  }

  return false;
};

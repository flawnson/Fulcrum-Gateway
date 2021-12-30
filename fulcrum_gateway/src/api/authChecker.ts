import { AuthChecker } from "type-graphql";
import { Context } from "./context.interface";

// create auth checker function
export const authChecker: AuthChecker<Context> = ({ context: { req, prisma } }, roles) => {
  if(req.session.queueId){
    return true;
  }
  return false;
};

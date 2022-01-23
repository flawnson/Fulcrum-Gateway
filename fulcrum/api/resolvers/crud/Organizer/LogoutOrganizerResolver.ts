import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { Context } from "../../../context.interface";


@Resolver()
export class LogoutOrganizerResolver {
  @Mutation(() => Boolean)
  async logoutOrganizer(@Ctx() ctx: Context): Promise<Boolean> {
    // clear organizer id from session
    delete ctx.req.session!.organizerId;

    if (!ctx.req.session.organizerId && !ctx.req.session.queueId && !ctx.req.session.userId){
      // if session variables are empty then destroy the session
      return new Promise((res, rej) =>
        ctx.req.session!.destroy(err => {
          if (err) {
            console.log("Cannot destroy session");
            console.log(err);
            return rej(false);
          }

          ctx.res.clearCookie("qid");
          return res(true);
        })
      );
    }
    else {
      return true;
    }
  }
}

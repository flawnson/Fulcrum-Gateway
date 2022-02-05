import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field, Authorized
} from "type-graphql";
import { Context } from "../../../context.interface";
import { cookieName } from "../../../constants";

@Resolver()
export class LogoutQueueResolver {
  @Authorized(["ASSISTANT"])
  @Mutation(returns => Boolean)
  async logoutQueue(@Ctx() ctx: Context): Promise<Boolean> {
    // clear queue id from session
    delete ctx.req.session!.queueId;

    // if this was the last id in the session, just destroy the session + cookie
    if (!ctx.req.session.organizerId && !ctx.req.session.queueId && !ctx.req.session.userId){
      // if session variables are empty then destroy the session
      return new Promise((res, rej) =>
        ctx.req.session!.destroy(err => {
          if (err) {
            console.log(err);
            return rej(false);
          }

          ctx.res.clearCookie(cookieName);
          return res(true);
        })
      );
    }
    else {
      return true;
    }
  }
}

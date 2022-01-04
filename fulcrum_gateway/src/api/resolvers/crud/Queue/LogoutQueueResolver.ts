import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { Context } from "../../../context.interface";


@Resolver()
export class LogoutQueueResolver {
  @Mutation(() => Boolean)
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

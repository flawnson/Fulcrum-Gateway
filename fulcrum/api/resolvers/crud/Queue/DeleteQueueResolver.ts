import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";
import { Queue } from "../../../generated/type-graphql/models/Queue";
import { Prisma } from "@prisma/client";

import { Context } from "../../../context.interface";
import { queueAccessPermission } from "../../../middleware/queueAccessPermission";

@ArgsType()
class DeleteQueueArgs {
  @Field({
    nullable: false
  })
  queueId!: string;
}

@Resolver()
export class DeleteQueueResolver {

  @Authorized("ORGANIZER")
  @UseMiddleware(queueAccessPermission)
  @Mutation(returns => Queue, {
    nullable: true
  })
  async deleteQueue(@Ctx() ctx: Context, @Args() args: DeleteQueueArgs): Promise<Queue | null> {

    // Delete the queue itself
    const deleteQueue = await ctx.prisma.queue.delete({
      where: {
        id: args.queueId,
      },
    })

    // NOTE: only organizer can delete queue
    // // logout assistant if they're in the same session
    // // clear queue id from session
    // delete ctx.req.session!.queueId;
    //
    // // if this was the last id in the session, just destroy the session + cookie
    // if (!ctx.req.session.organizerId && !ctx.req.session.queueId && !ctx.req.session.userId){
    //   // if session variables are empty then destroy the session
    //   await ctx.req.session!.destroy(err => {
    //       if (err) {
    //         console.log(err);
    //       }
    //   })
    //   await ctx.res.clearCookie("qid");
    // }

    return deleteQueue;


  }

}

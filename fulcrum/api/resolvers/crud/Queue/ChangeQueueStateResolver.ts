import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";
import { Queue } from "../../../generated/type-graphql/models/Queue";
import { QueueState } from "@prisma/client";
import * as helpers from "../../../helpers";
import { queueAccessPermission } from "../../../middleware/queueAccessPermission";
import { Context } from "../../../context.interface";
import { errors } from "../../../constants";
import { QueueResult } from "../../../types";

@ArgsType()
class ChangeQueueStateArgs {
  @Field({
    nullable: true
  })
  queueId?: string; //assistant will access queue id through context

  @Field({
    nullable: false
  })
  state!: QueueState;
}


@Resolver()
export class ChangeQueueStateResolver {

  @Authorized(["ORGANIZER", "ASSISTANT"])
  @UseMiddleware(queueAccessPermission)
  @Mutation(returns => QueueResult, {
    nullable: true
  })
  async changeQueueState(@Ctx() ctx: Context, @Args() args: ChangeQueueStateArgs): Promise<typeof QueueResult> {
    let queryQueueId = "";

    if (ctx.req.session.queueId) {
      queryQueueId = ctx.req.session.queueId;
    }

    if (args.queueId) {
      queryQueueId = args.queueId;
    }

    const updateQueue = await ctx.prisma.queue.update({
      where: {
        id: queryQueueId,
      },
      data: {
        state: args.state
      }
    })

    if(!updateQueue){
      let error = {
        error: errors.CANNOT_UPDATE_QUEUE
      };
      return error;
    }

    return updateQueue;

  }
}

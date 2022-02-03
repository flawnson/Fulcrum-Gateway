import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";
import { Queue } from "../../../generated/type-graphql/models/Queue";
import { Context } from "../../../context.interface";
import * as helpers from "../../../helpers";
import { queueAccessPermission } from "../../../middleware/queueAccessPermission";
import { errors } from "../../../constants";
import { QueueResult } from "../../../types";

@ArgsType()
class GetQueueArgs {
  @Field({
    nullable: true
  })
  queueId?: string;
}

@Resolver()
export class GetQueueResolver {

  @Authorized(["ORGANIZER", "ASSISTANT"])
  @UseMiddleware(queueAccessPermission)
  @Query(returns => QueueResult, {
    nullable: true
  })
  async getQueue(@Ctx() ctx: Context, @Args() args: GetQueueArgs): Promise<typeof QueueResult> {

    let queryQueueId = "";

    if (ctx.req.session.queueId) {
      queryQueueId = ctx.req.session.queueId;
    }

    if (args.queueId) {
      queryQueueId = args.queueId;
    }

    const queue = await ctx.prisma.queue.findUnique({
      where: {
        id: queryQueueId
      }
    });

    if(!queue){
      let error = {
        error: errors.QUEUE_DOES_NOT_EXIST
      };
      return error;
    }

    return queue;

  }
}

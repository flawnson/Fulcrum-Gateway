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

import { errors } from "../../../constants";
import { QueueResult } from "../../../types";

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
  @Mutation(returns => QueueResult, {
    nullable: true
  })
  async deleteQueue(@Ctx() ctx: Context, @Args() args: DeleteQueueArgs): Promise<typeof QueueResult> {

    // Delete the queue itself
    const deleteQueue = await ctx.prisma.queue.delete({
      where: {
        id: args.queueId,
      },
    })

    if(!deleteQueue){
      let error = {
        error: errors.QUEUE_DOES_NOT_EXIST
      };
      return error;
    }

    return deleteQueue;


  }

}

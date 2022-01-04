import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { Prisma } from "@prisma/client";

import { Context } from "../../../context.interface";
import { queueAccessPermission } from "../../../middleware/queueAccessPermission";

@ArgsType()
class DeleteQueueArgs {
  @Field({
    nullable: true
  })
  queueId?: string;
}

@Resolver()
export class DeleteQueueResolver {

  @Authorized("ORGANIZER")
  @UseMiddleware(queueAccessPermission)
  @Mutation(returns => Queue, {
    nullable: true
  })
  async deleteQueue(@Ctx() { req, prisma }: Context, @Args() args: DeleteQueueArgs): Promise<Queue | null> {

    let queryQueueId = "";

    if (req.session.queueId) {
      queryQueueId = req.session.queueId;
    }

    if (args.queueId) {
      queryQueueId = args.queueId;
    }


    // Then delete the queue itself
    const deleteQueue = prisma.queue.delete({
      where: {
        id: queryQueueId,
      },
    })

    return deleteQueue;


  }

}

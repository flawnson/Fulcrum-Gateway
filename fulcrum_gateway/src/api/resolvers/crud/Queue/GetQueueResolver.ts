import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { Context } from "../../../context.interface";
import * as helpers from "../../../helpers";
import { queueAccessPermission } from "../../../middleware/queueAccessPermission";


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
  @Query(returns => Queue, {
    nullable: true
  })
  async getQueue(@Ctx() { req, prisma }: Context, @Args() args: GetQueueArgs): Promise<Queue | null> {

    let queryQueueId = "";

    if (req.session.queueId) {
      queryQueueId = req.session.queueId;
    }

    if (args.queueId) {
      queryQueueId = args.queueId;
    }

    const queue = prisma.queue.findUnique({
      where: {
        id: queryQueueId
      }
    });

    return queue;

  }
}

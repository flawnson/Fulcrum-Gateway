import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized
} from "type-graphql";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { Context } from "../../../context.interface";

@Resolver()
export class GetQueueResolver {

  @Authorized("ORGANIZER")
  @Query(returns => Queue, {
    nullable: true
  })
  async getQueue(@Ctx() { req, prisma }: Context): Promise<Queue | null> {

    if (!req.session.queueId){
      return null;
    }

    const queue = prisma.queue.findUnique({
      where: {
        id: req.session.queueId,
      }
    });

    return queue;

  }
}

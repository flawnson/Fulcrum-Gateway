import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";
import bcrypt from "bcryptjs";

import { redis } from "../../../redisClient";
import { Organizer } from "../../../../../prisma/generated/type-graphql/models/Organizer";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { Context } from "../../../context.interface";
import { queueAccessPermission } from "../../../middleware/queueAccessPermission";

@ArgsType()
class ChangeQueuePasswordArgs {
  @Field({
    nullable: false
  })
  queueId!: string;

  @Field({
    nullable: false
  })
  password!: string;
}


@Resolver()
export class ChangeQueuePasswordResolver {
  @Authorized("ORGANIZER")
  @UseMiddleware(queueAccessPermission)
  @Mutation(() => Queue, { nullable: true })
  async changeQueuePassword(@Ctx() ctx: Context, @Args() args: ChangeQueuePasswordArgs,): Promise<Queue | null> {

    const hashedPassword = await bcrypt.hash(args.password, 12);
    const updateQueue = await ctx.prisma.queue.update({
      where: {
        id: args.queueId
      },
      data: {
        password: hashedPassword
      }
    });

    return updateQueue;

  }

}

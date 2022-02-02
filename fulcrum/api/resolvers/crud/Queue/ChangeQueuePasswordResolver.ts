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
import { Organizer } from "../../../generated/type-graphql/models/Organizer";
import { Queue } from "../../../generated/type-graphql/models/Queue";
import { Context } from "../../../context.interface";
import { queueAccessPermission } from "../../../middleware/queueAccessPermission";
import { errors } from "../../../constants";
import { QueueResult } from "../../../types";

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
  @Mutation(returns => QueueResult, { nullable: true })
  async changeQueuePassword(@Ctx() ctx: Context, @Args() args: ChangeQueuePasswordArgs,): Promise<typeof QueueResult> {

    const hashedPassword = await bcrypt.hash(args.password, 12);
    const updateQueue = await ctx.prisma.queue.update({
      where: {
        id: args.queueId
      },
      data: {
        password: hashedPassword
      }
    });

    if(!updateQueue){
      console.log("Queue password change failed");
      let error = {
        error: errors.PASSWORD_CHANGE_FAILED
      };
      return error;
    }

    return updateQueue;

  }

}

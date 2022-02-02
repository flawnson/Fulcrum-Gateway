import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";

import { Queue } from "../../../generated/type-graphql/models/Queue";
import bcrypt from "bcryptjs";
import { Context } from "../../../context.interface";
import { errors } from "../../../constants";
import { QueueResult } from "../../../types";

@ArgsType()
class LoginQueueArgs {
  @Field({
    nullable: false
  })
  joinCode!: string;

  @Field({
    nullable: false
  })
  password!: string;
}

@Resolver()
export class LoginQueueResolver {
  @Mutation(returns => QueueResult, { nullable: true })
  async loginQueue(@Ctx() ctx: Context, @Args() args: LoginQueueArgs): Promise<typeof QueueResult> {
    const queue = await ctx.prisma.queue.findUnique({
      where: {
        join_code: args.joinCode
      }
    });

    if (!queue) {
      let error = {
        error: errors.QUEUE_DOES_NOT_EXIST
      };
      return error;
    }

    const valid = await bcrypt.compare(args.password, queue.password);

    if (!valid) {
      let error = {
        error: errors.INCORRECT_PASSWORD
      };
      return error;
    }

    ctx.req.session!.queueId = queue.id;

    return queue;
  }

}

import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";

import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import bcrypt from "bcryptjs";
import { Context } from "../../../context.interface";

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
  @Mutation(() => Queue, { nullable: true })
  async loginQueue(@Ctx() { req, prisma }: Context, @Args() args: LoginQueueArgs): Promise<Queue | null> {
    const queue = await prisma.queue.findUnique({
      where: {
        join_code: args.joinCode
      }
    });

    if (!queue) {
      return null;
    }

    const valid = await bcrypt.compare(args.password, queue.password);

    if (!valid) {
      return null;
    }

    req.session!.queueId = queue.id;

    return queue;
  }

}

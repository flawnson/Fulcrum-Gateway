import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";

import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { PrismaClient } from "@prisma/client";
import { Session, SessionData } from "express-session";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";

interface Context {
  req: Request & { session: Session & Partial<SessionData> & {
    test?: string,
    queueId?: string 
  }},
  // res: Response
  // redis: typeof Redis
  prisma: PrismaClient;
}

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
  async loginQueue(@Ctx() ctx: Context, @Args() args: LoginQueueArgs): Promise<Queue | null> {
    const queue = await ctx.prisma.queue.findUnique({
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

    ctx.req.session!.queueId = queue.id;

    return queue;
  }

}

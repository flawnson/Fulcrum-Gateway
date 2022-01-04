import { Resolver, Mutation, Arg, UseMiddleware } from "type-graphql";
import bcrypt from "bcryptjs";

import { redis } from "../../../redisClient";
import { Organizer } from "../../../../../prisma/generated/type-graphql/models/Organizer";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { Context } from "../../../context.interface";
import { forgotOrganizerPasswordPrefix } from "../../../constants";
import { queueAccessPermission } from "../../../middleware/queueAccessPermission";

@ArgsType()
class ChangeOrganizerPasswordArgs {
  @Field({
    nullable: false
  })
  token!: string;

  @Field({
    nullable: false
  })
  password!: string;
}

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
export class ChangePasswordResolver {
  @Mutation(() => Organizer, { nullable: true })
  async changeOrganizerPassword(@Ctx() { req, prisma }: Context, @Args() args: ChangeOrganizerPasswordArgs): Promise<Organizer | null> {
    // fetch id from redis via token
    const organizerId = await redis.get(forgotOrganizerPasswordPrefix + token);

    if (!organizerID) {
      return null;
    }

    const organizer = await prisma.organizer.findUnique({
      where: {
        id: organizerId
      }
    });

    if (!organizer) {
      return null;
    }

    await redis.del(forgotOrganizerPasswordPrefix + token);

    const hashedPassword = await bcrypt.hash(args.password, 12);

    const update = await prisma.organizer.update({
      where: {
        id: organizerId
      },
      data: {
        password: hashedPassword
      }
    });

    req.session!.organizerId = organizer.id;

    return organizer;
  }

  @Authorized("ORGANIZER")
  @UseMiddleware(queueAccessPermission)
  @Mutation(() => Queue, { nullable: true })
  async changeQueuePassword(@Ctx() { req, prisma }: Context, @Args() args: ChangeQueuePasswordArgs,): Promise<Queue | null> {

    const hashedPassword = await bcrypt.hash(args.password, 12);
    const updateQueue = await prisma.queue.update({
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

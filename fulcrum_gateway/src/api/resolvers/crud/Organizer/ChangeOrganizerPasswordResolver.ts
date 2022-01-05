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


@Resolver()
export class ChangeOrganizerPasswordResolver {
  @Mutation(() => Organizer, { nullable: true })
  async changeOrganizerPassword(@Ctx() ctx: Context, @Args() args: ChangeOrganizerPasswordArgs): Promise<Organizer | null> {
    // fetch id from redis via token
    const organizerId = await redis.get(args.token);

    if (!organizerId) {
      return null;
    }

    const organizer = await ctx.prisma.organizer.findUnique({
      where: {
        id: organizerId
      }
    });

    if (!organizer) {
      return null;
    }

    await redis.del(args.token);

    const hashedPassword = await bcrypt.hash(args.password, 12);

    const update = await ctx.prisma.organizer.update({
      where: {
        id: organizerId
      },
      data: {
        password: hashedPassword
      }
    });

    ctx.req.session!.organizerId = organizer.id;

    return organizer;
  }


}

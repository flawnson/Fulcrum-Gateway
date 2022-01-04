import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";

import { redis } from "../../../redisClient";
import { Organizer } from "../../../../../prisma/generated/type-graphql/models/Organizer";
import { confirmOrganizerPrefix } from "../../../constants";
import { Context } from "../../../context.interface";


@ArgsType()
class ConfirmOrganizerArgs {

  @Field({
    nullable: false
  })
  token!: string;

}

@Resolver()
export class ConfirmOrganizerResolver {
  @Mutation(() => Boolean)
  async confirmOrganizer(@Ctx() ctx: Context, @Args() args: ConfirmOrganizerArgs): Promise<boolean> {
  
    const organizerId = await redis.get(confirmOrganizerPrefix + args.token);

    if (!organizerId) {
      return false;
    }

    const update = await ctx.prisma.organizer.update({
      where: {
        id: organizerId
      },
      data: {
        confirmed: true
      }
    });

    await redis.del(confirmOrganizerPrefix + args.token);

    return true;
  }
}
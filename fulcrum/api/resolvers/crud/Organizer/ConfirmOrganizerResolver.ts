import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";

import { redis } from "../../../redisClient";
import { Organizer } from "../../../generated/type-graphql/models/Organizer";
import { Context } from "../../../context.interface";
import { OrganizerResult } from "../../../types";
import { errors } from "../../../constants";

@ArgsType()
class ConfirmOrganizerArgs {

  @Field({
    nullable: false
  })
  token!: string;

}

@Resolver()
export class ConfirmOrganizerResolver {
  @Mutation(returns => OrganizerResult)
  async confirmOrganizer(@Ctx() ctx: Context, @Args() args: ConfirmOrganizerArgs): Promise<typeof OrganizerResult> {

    const organizerId = await redis.get(args.token);

    if (!organizerId) {
      console.log("Can't confirm organizer account: Organizer confirmation token does not exist.")
      let error = {
        error: errors.ACCOUNT_CONFIRM_FAILED
      };
      return error;
    }

    const update = await ctx.prisma.organizer.update({
      where: {
        id: organizerId
      },
      data: {
        confirmed: true
      }
    });

    await redis.del(args.token);

    return update;
  }
}

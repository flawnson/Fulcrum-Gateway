import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";

import { redis } from "../../../redisClient";
import { User } from "../../../generated/type-graphql/models/User";
import { Context } from "../../../context.interface";
import { UserStatus } from "@prisma/client";
import { confirmUserPrefix } from "../../../constants";



@ArgsType()
class ConfirmUserArgs {

  @Field({
    nullable: false
  })
  confirmCode!: string;

}

@Resolver()
export class ConfirmUserResolver {
  @Mutation(() => Boolean)
  async confirmUser(@Ctx() ctx: Context, @Args() args: ConfirmUserArgs): Promise<boolean> {

    const userId = await redis.get(confirmUserPrefix + args.confirmCode);

    if (!userId) {
      console.log("Can't confirm user: Invalid confirmation code");
      return false;
    }

    const update = await ctx.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        status: UserStatus.ENQUEUED
      }
    });

    await redis.del(confirmUserPrefix + args.confirmCode);

    // create session
    ctx.req.session!.userId = userId;

    return true;
  }
}

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
import { forgotOrganizerPasswordPrefix } from "../../../constants";
import { errors } from "../../../constants";
import { OrganizerResult } from "../../../types";

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
  @Mutation(returns => OrganizerResult, {
    nullable: true
  })
  async changeOrganizerPassword(@Ctx() ctx: Context, @Args() args: ChangeOrganizerPasswordArgs): Promise<typeof OrganizerResult> {
    // fetch id from redis via token
    const organizerId = await redis.get(forgotOrganizerPasswordPrefix + args.token);

    if (!organizerId) {
      console.log("Unable to change password: Organizer password change token does not exist.")
      let error = {
        error: errors.PASSWORD_CHANGE_FAILED
      };
      return error;
    }

    const organizer = await ctx.prisma.organizer.findUnique({
      where: {
        id: organizerId
      }
    });

    if (!organizer) {
      console.log("Unable to change password: Organizer does not exist.")
      let error = {
        error: errors.ORGANIZER_DOES_NOT_EXIST
      };
      return error;
    }

    await redis.del(forgotOrganizerPasswordPrefix + args.token);

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

import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";
import { User } from "../../../generated/type-graphql/models/User";
import { Context } from "../../../context.interface";
import * as helpers from "../../../helpers";
import { userAccessPermission } from "../../../middleware/userAccessPermission";

@ArgsType()
class GetUserArgs {
  @Field({
    nullable: true
  })
  userId?: string;
}

@Resolver()
export class GetUserResolver {

  @Authorized()
  @UseMiddleware(userAccessPermission)
  @Query(returns => User, {
    nullable: true
  })
  async getUser(@Ctx() ctx: Context, @Args() args: GetUserArgs): Promise<User | null> {

    let queryUserId = "";

    if (ctx.req.session!.userId) {
      queryUserId = ctx.req.session!.userId;
    }

    if (args.userId) {
      queryUserId = args.userId;
    }

    const user = await ctx.prisma.user.findUnique({
      where: {
        id: queryUserId,
      }
    });

    return user;

  }
}

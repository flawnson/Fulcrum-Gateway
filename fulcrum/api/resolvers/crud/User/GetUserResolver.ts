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
import { UserResult } from "../../../types";
import { errors } from "../../../constants";


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
  @Query(returns => UserResult, {
    nullable: true
  })
  async getUser(@Ctx() ctx: Context, @Args() args: GetUserArgs): Promise<typeof UserResult> {

    let queryUserId = "";

    if (ctx.req.session!.userId) {
      queryUserId = ctx.req.session!.userId;
    }

    if (args.userId) {
      queryUserId = args.userId;
    }
    console.log("Get user");
    console.log("Waiting for prisma (get user)");
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: queryUserId,
      }
    });
    console.log("Done waiting for prisma (get user)");

    if(!user){
      let error = {
        error: errors.USER_DOES_NOT_EXIST
      };
      return error;
    }

    return user;

  }
}

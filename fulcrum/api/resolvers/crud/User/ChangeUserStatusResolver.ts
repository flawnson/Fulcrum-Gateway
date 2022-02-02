import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";
import { User } from "../../../generated/type-graphql/models/User";
import { UserStatus } from "@prisma/client";
import * as helpers from "../../../helpers";

import { Context } from "../../../context.interface";
import { userAccessPermission } from "../../../middleware/userAccessPermission";
import { errors } from "../../../constants";
import { UserResult } from "../../../types";

@ArgsType()
class ChangeStatusArgs {
  @Field({
    nullable: true
  })
  userId?: string;

  @Field({
    nullable: false
  })
  status!: UserStatus;
}


@Resolver()
export class ChangeUserStatusResolver {

  @Authorized()
  @UseMiddleware(userAccessPermission)
  @Mutation(returns => UserResult, {
    nullable: true
  })
  async changeStatus(@Ctx() ctx: Context, @Args() args: ChangeStatusArgs): Promise<typeof UserResult> {

    let queryUserId = "";

    if (ctx.req.session!.userId) {
      queryUserId = ctx.req.session!.userId;
    }

    if (args.userId) {
      queryUserId = args.userId;
    }

    // if all is fine, update the status of the user
    const updatedUser = await helpers.updateUserStatus(queryUserId, args.status);
    return updatedUser;
  }
}

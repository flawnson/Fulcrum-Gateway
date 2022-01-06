import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { Context } from "../../../context.interface";
import * as helpers from "../../../helpers";
import _ from 'lodash'
import { userAccessPermission } from "../../../middleware/userAccessPermission";


@ArgsType()
class DeferUserArgs {
  @Field({
    nullable: true
  })
  userId?: string;

  @Field({
    nullable: false
  })
  time!: string;
}

@Resolver()
export class DeferUserResolver {

  @Authorized()
  @UseMiddleware(userAccessPermission)
  @Mutation(returns => User, {
    nullable: true
  })
  async deferPosition(@Ctx() ctx: Context, @Args() args: DeferUserArgs): Promise<User | null> {

    let queryUserId = "";

    if (ctx.req.session!.userId) {
      queryUserId = ctx.req.session!.userId;
    }

    if (args.userId) {
      queryUserId = args.userId;
    }

    // Note to flawnson: Use queryUserId as the user id
    // ...TODO

    return null; //for now

  }
}

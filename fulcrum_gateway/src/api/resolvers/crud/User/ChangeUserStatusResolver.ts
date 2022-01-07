import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { UserStatus } from "@prisma/client";
import * as helpers from "../../../helpers";

import { Context } from "../../../context.interface";

@ArgsType()
class ChangeUserStatusArgs {
  @Field({
    nullable: false
  })
  userId!: string;

  @Field({
    nullable: false
  })
  status!: UserStatus;
}


@Resolver()
export class ChangeUserStatusResolver {

  @Authorized("ORGANIZER")
  @Mutation(returns => User, {
    nullable: true
  })
  async changeUserStatus(@Ctx() ctx: Context, @Args() args: ChangeUserStatusArgs): Promise<User | null> {
    if (!ctx.req.session.queueId){
      return null;
    }

    //check if the user you would to change is in the queue you own
    const exists = await helpers.userExistsInQueue(args.userId, ctx.req.session.queueId);
    if (exists === false){
      return null;
    }


    // if all is fine, update the status of the user
    const updatedUser = await helpers.updateUserStatus(args.userId, args.status);
    return updatedUser;
  }
}

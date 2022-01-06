import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { Context } from "../../../context.interface";
import * as helpers from "../../../helpers";

@ArgsType()
class SummonUserArgs {
  @Field({
    nullable: false
  })
  userId!: string;
}


@Resolver()
export class SummonUserResolver {

  @Authorized("ORGANIZER")
  @Mutation(returns => User, {
    nullable: true
  })
  async summon(@Ctx() ctx: Context, @Args() args: SummonUserArgs): Promise<User | null> {
    if (!ctx.req.session.queueId){
      return null;
    }

    //check if the user you would to change is in the queue you own
    const exists = await helpers.userExistsInQueue(args.userId, ctx.req.session.queueId);
    if (exists === false){
      return null;
    }

    // check if user is ENQUEUED
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: args.userId
      }
    });

    if (user != null) {
      if (user.status == "ENQUEUED" || user.status == "DEFERRED") {

        const currentTime = new Date();
        // set user summoned_time
        const setSummoned = await ctx.prisma.user.update({
          where: {
            id: args.userId
          },
          data: {
            summoned_time: currentTime,
            summoned: true
          }
        });

        return setSummoned;
      }
      else {
        console.log("User with id " + args.userId + " is not ENQUEUED/DEFERRED status. Can't be summoned. ");
      }
    }
    else {
      console.log("User with id " + args.userId + " does not exist");
    }

    return null;
  }
}

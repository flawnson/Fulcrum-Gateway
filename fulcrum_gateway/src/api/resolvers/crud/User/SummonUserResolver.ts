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
import { userAccessPermission } from "../../../middleware/userAccessPermission";
import { sendSMS } from "../../../helpers";

@ArgsType()
class SummonUserArgs {
  @Field({
    nullable: false
  })
  userId!: string;
}


@Resolver()
export class SummonUserResolver {

  @Authorized(["ORGANIZER", "ASSISTANT"])
  @UseMiddleware(userAccessPermission)
  @Mutation(returns => User, {
    nullable: true
  })
  async summon(@Ctx() ctx: Context, @Args() args: SummonUserArgs): Promise<User | null> {

    // check if user is ENQUEUED
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: args.userId
      },
      include: {
        queue: true
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

        // send SMS message to user
        if (!user.phone_number){
          console.log("User with id " + args.userId + " does not have a phone number.");
        }
        else {
          await sendSMS(user.phone_number, user.queue.name + ": It is your turn now! You are now at the front of the line, please proceed. Thanks for waiting!", "Summon");
        }

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

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
import { sendSMS } from "../../../helpers";
import { UserResult } from "../../../types";
import { errors } from "../../../constants";

@ArgsType()
class SummonUserArgs {
  @Field({
    nullable: false
  })
  userId!: string;

  @Field({
    nullable: false
  })
  summoned!: boolean;
}


@Resolver()
export class SummonUserResolver {

  @Authorized(["ORGANIZER", "ASSISTANT"])
  @UseMiddleware(userAccessPermission)
  @Mutation(returns => UserResult, {
    nullable: true
  })
  async toggleSummon(@Ctx() ctx: Context, @Args() args: SummonUserArgs): Promise<typeof UserResult> {

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
        let setSummoned;

        if (args.summoned === true){
          // summon
          // set user summoned_time
          setSummoned = await ctx.prisma.user.update({
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
            let error = {
              error: errors.USER_HAS_NO_PHONE_NUMBER
            };
            return error;
          }
          else {
            await sendSMS(user.phone_number, user.queue.name + ": It is your turn now! You are now at the front of the line, please proceed. Thanks for waiting!", "Summon");
          }
        }
        else {
          // unsummon
          setSummoned = await ctx.prisma.user.update({
            where: {
              id: args.userId
            },
            data: {
              summoned_time: null,
              summoned: false
            }
          });

        }

        return setSummoned;
      }
      else {
        console.log("User with id " + args.userId + " is not ENQUEUED/DEFERRED status. Can't be summoned/unsummoned. ");
        let error = {
          error: errors.USER_NOT_ENQUEUED
        };
        return error;
      }
    }

    console.log("User with id " + args.userId + " does not exist");

    let error = {
      error: errors.USER_DOES_NOT_EXIST
    };
    return error;
  }

}

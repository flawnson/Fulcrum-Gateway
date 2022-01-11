import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { Context } from "../../../context.interface";
import { sendSMS } from "../../../helpers";
import { redis } from "../../../redisClient";


@ArgsType()
class CreateUserArgs {
  @Field({
    nullable: false
  })
  joinCode!: string;

  @Field({
    nullable: true
  })
  phoneNumber?: string;

  @Field({
    nullable: false
  })
  name!: string;
}

@Resolver()
export class CreateUserResolver {

  @Mutation(returns => User, {
    nullable: true
  })
  async createUser(@Ctx() ctx: Context, @Args() args: CreateUserArgs): Promise<User | null> {
    // make queries atomic so they immediately follow one another (prevents joining a queue that just got deleted)
    return await ctx.prisma.$transaction(async (prisma) => {

      // convert joincode to all lowercase for comparison
      args.joinCode = args.joinCode.toLowerCase();

      //check if theres a queue with that join code
      const result = await prisma.queue.findUnique({
        where: {
          join_code: args.joinCode,
        },
        include: {
          users: true
        }
      });

      if (result == null) {
        console.log("Cannot join: Queue with code " + args.joinCode + " does not exist.");
        return null;
      }

      if (result.state == "INACTIVE" || result.state == "PAUSED"){
        console.log("Cannot join: Queue with code " + args.joinCode + " is INACTIVE or PAUSED.");
        return null;
      }

      // calculate the user's index
      const index = result.users.length + 1;
      const currentTime = new Date();
      const queueId = result.id;
      // create a new user (by default unverified)
      const createUser = await prisma.user.create({
        data: {
          name: args.name,
          queue_id: queueId,
          phone_number: args.phoneNumber,
          join_time: currentTime,
          index: index
        }
      });

      // generate a verification code only if phone number exists
      if (createUser != null && args.phoneNumber != null){
        // generate 6 digit verification code
        let confirmCode = Math.floor(100000 + Math.random() * 900000).toString();
        //check if this verification code is already in use by another user
        while (true) {
          const checkCode = await redis.get(confirmCode);
          if (checkCode) {
            console.log("Code " + confirmCode + " already exists, generating new one");
            // already exists, generate new code
            confirmCode = Math.floor(100000 + Math.random() * 900000).toString();
          }
          else {
            break;
          }
        }
        // save code to redis
        await redis.set(confirmCode, createUser.id, "ex", 60 * 60 * 0.5); // 0.5 hour expiration

        // send SMS here
        await sendSMS(args.phoneNumber, confirmCode);

      }

      return createUser;

    })
  }


}

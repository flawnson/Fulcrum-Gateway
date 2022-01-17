import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware,

} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { Context } from "../../../context.interface";
import { sendSMS } from "../../../helpers";
import { redis } from "../../../redisClient";
import { confirmUserPrefix } from "../../../constants";
import { queueAccessPermission } from "../../../middleware/queueAccessPermission";
import { UserStatus } from '@prisma/client';

@ArgsType()
class JoinQueueArgs {
  @Field({
    nullable: false
  })
  joinCode!: string;

  @Field({
    nullable: false
  })
  phoneNumber!: string;

  @Field({
    nullable: false
  })
  name!: string;
}

@ArgsType()
class CreateUserArgs {
  @Field({
    nullable: true
  })
  queueId?: string;

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

  @Authorized(["ORGANIZER", "ASSISTANT"])
  @UseMiddleware(queueAccessPermission)
  @Mutation(returns => User, {
    nullable: true
  })
  async createUser(@Ctx() ctx: Context, @Args() args: CreateUserArgs): Promise<User | null> {
    let queryQueueId = "";

    if (ctx.req.session.queueId) {
      queryQueueId = ctx.req.session.queueId;
    }

    if (args.queueId) {
      queryQueueId = args.queueId;
    }

    // make queries atomic so they immediately follow one another (prevents joining a queue that just got deleted)
    return await ctx.prisma.$transaction(async (prisma) => {

      //check if theres a queue with that id
      const result = await prisma.queue.findUnique({
        where: {
          id: queryQueueId,
        },
        include: {
          users: true
        }
      });

      if (result == null) {
        console.log("Cannot join: Queue with id " + queryQueueId + " does not exist.");
        return null;
      }

      if (result.state == "INACTIVE" || result.state == "PAUSED"){
        console.log("Cannot join: Queue with id " + queryQueueId + " is INACTIVE or PAUSED.");
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
          index: index,
          status: UserStatus.ENQUEUED
        }
      });

      return createUser;

    })
  }

  @Mutation(returns => User, {
    nullable: true
  })
  async joinQueue(@Ctx() ctx: Context, @Args() args: JoinQueueArgs): Promise<User | null> {
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

      // generate a verification code
      if (createUser != null){
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
        await redis.set(confirmUserPrefix + confirmCode, createUser.id, "ex", 60 * 60 * 0.5); // 0.5 hour expiration

        // send SMS here
        await sendSMS(args.phoneNumber, confirmCode + " is your Fiefoe verification code.", "Confirm");

      }

      return createUser;

    })
  }


}

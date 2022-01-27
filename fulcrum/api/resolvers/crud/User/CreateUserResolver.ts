import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field,
  Authorized, UseMiddleware,
  ObjectType,
  createUnionType
} from "type-graphql";
import { User } from "../../../generated/type-graphql/models/User";
import { Context } from "../../../context.interface";
import { sendSMS } from "../../../helpers";
import { redis } from "../../../redisClient";
import { confirmUserPrefix } from "../../../constants";
import { queueAccessPermission } from "../../../middleware/queueAccessPermission";
import { UserStatus, Prisma } from '@prisma/client';
import { Error } from "../../../types";
import { errors } from "../../../constants";

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


const CreateUserResult = createUnionType({
  name: "CreateUserResult", // the name of the GraphQL union
  types: () => [User, Error] as const, // function that returns tuple of object types classes
  // our implementation of detecting returned object type
  resolveType: value => {
    if ("error" in value) {
      return Error; // we can return object type class (the one with `@ObjectType()`)
    }
    if ("id" in value) {
      return User; // or the schema name of the type as a string
    }
    return null;
  }
});

async function generateSMS(phoneNumber: string, userId: string){
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
  await redis.set(confirmUserPrefix + confirmCode, userId, "ex", 60 * 60 * 0.5); // 0.5 hour expiration
  // send SMS here
  await sendSMS(phoneNumber, confirmCode + " is your Fiefoe verification code.", "Confirm");
}

@Resolver()
export class CreateUserResolver {

  @Authorized(["ORGANIZER", "ASSISTANT"])
  @UseMiddleware(queueAccessPermission)
  @Mutation(returns => CreateUserResult, {
    nullable: true
  })
  async createUser(@Ctx() ctx: Context, @Args() args: CreateUserArgs): Promise<typeof CreateUserResult> {
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
          users: {
            where: {
              index: {
                gt: 0
              }
            },
            orderBy: {
              index: 'asc',
            }
          }
        }
      });

      if (result == null) {
        console.log("Cannot join: Queue with id " + queryQueueId + " does not exist.");
        return {
          error: errors.QUEUE_DOES_NOT_EXIST
        };
      }

      if (result.state == "PAUSED"){
        console.log("Cannot join: Queue with id " + queryQueueId + " is not ACTIVE.");
        return {
          error: errors.QUEUE_NOT_ACTIVE
        };
      }

      // calculate the user's index
      const index = result.users.length + 1;
      const currentTime = new Date();
      const queueId = result.id;
      // create a new user (by default unverified)
      try {
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
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          // The .code property can be accessed in a type-safe manner
          if (e.code === 'P2002') {
            console.log('Cannot join: Phone number ' + args.phoneNumber + ' is taken.');
            let error = {
              error: errors.PHONE_NUMBER_NOT_UNIQUE
            };
            return error;
          }
        }

        throw e;
      }

    })
  }

  @Mutation(returns => CreateUserResult, {
    nullable: true
  })
  async joinQueue(@Ctx() ctx: Context, @Args() args: JoinQueueArgs): Promise<typeof CreateUserResult> {
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
          users: {
            where: {
              index: {
                gt: 0
              }
            },
            orderBy: {
              index: 'asc',
            }
          }
        }
      });

      if (result == null) {
        console.log("Cannot join: Queue with code " + args.joinCode + " does not exist.");
        let error = {
          error: errors.QUEUE_DOES_NOT_EXIST
        };
        return error;
      }

      if (result.state == "PAUSED"){
        console.log("Cannot join: Queue with code " + args.joinCode + " is not ACTIVE.");
        let error = {
          error: errors.QUEUE_NOT_ACTIVE
        };
        return error;
      }

      // calculate the user's index
      const index = result.users.length + 1;
      const currentTime = new Date();
      const queueId = result.id;

      // check existing user
      const existingUser = await prisma.user.findUnique({
        where: {
          phone_number: args.phoneNumber
        }
      });

      // if already exists and UNVERIFIED
      if (existingUser){
        if (existingUser.status == "UNVERIFIED"){
          console.log('Phone number ' + args.phoneNumber + ' is already taken. User not verified, resending verification code if user exists.');
          await generateSMS(args.phoneNumber, existingUser.id);
          return existingUser;
        }
        console.log('Phone number ' + args.phoneNumber + ' is already taken. User is already verified and in queue.');
        let error = {
          error: errors.PHONE_NUMBER_NOT_UNIQUE
        };
        return error;
      }

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
        await generateSMS(args.phoneNumber, createUser.id);
      }

      return createUser;



    })
  }


}

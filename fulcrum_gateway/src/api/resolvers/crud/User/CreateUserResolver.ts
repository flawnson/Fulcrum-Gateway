import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { Context } from "../../../context.interface";
import { UserStatus } from "@prisma/client";

@ArgsType()
class CreateUserArgs {
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

@Resolver()
export class CreateUserResolver {

  @Mutation(returns => User, {
    nullable: true
  })
  async createUser(@Ctx() ctx: Context, @Args() args: CreateUserArgs): Promise<User | null> {
    return await ctx.prisma.$transaction(async (prisma) => {
      //check if theres a queue with that join code
      const results = await prisma.queue.findUnique({
        where: {
          join_code: args.joinCode,
        },
        include: {
          users: true
        }
      });

      if (results == null) {
        return null;
      }

      // get any previous user with the phone number
      const existingUser = await prisma.user.findUnique({
        where: {
          phone_number: args.phoneNumber
        }
      })

      // calculate the user's index
      const index = results.users.length + 1;
      const currentTime = new Date();
      const queueId = results.id;

      // check if the account with this phone number already exists on a leave state

      const leaveStatus = ["SERVICED", "ABANDONED", "NOSHOW", "KICKED"];

      if (existingUser != null && leaveStatus.includes(existingUser.status) === false){
        // user already exists and is in line
        return null;
      }

      if (existingUser != null && leaveStatus.includes(existingUser.status)){
        // existing user exists, update them
        const updateExisting = await prisma.user.update({
          where: {
            phone_number: args.phoneNumber
          },
          data: {
            name: args.name,
            queue_id: queueId,
            join_time: currentTime,
            index: index,
            status: UserStatus.ENQUEUED,
            summoned: false,
            reneged_time: null,
            total_wait: null,
            summoned_time: null,
            last_online: null
          }
        })

        ctx.req.session!.userId = updateExisting.id;
        return updateExisting;

      }
      else {
        // create a new user
        const createUser = await prisma.user.create({
          data: {
            name: args.name,
            queue_id: queueId,
            phone_number: args.phoneNumber,
            join_time: currentTime,
            index: index
          }
        });

        ctx.req.session!.userId = createUser.id;
        return createUser;
      }


    })
  }


}

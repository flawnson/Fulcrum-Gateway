import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { PrismaClient, UserStatus } from "@prisma/client";

interface Context {
  prisma: PrismaClient;
}

@ArgsType()
class StatusChangeArgs {
  @Field({
    nullable: false
  })
  id!: string;

  @Field({
    nullable: false
  })
  status!: UserStatus;
}


@Resolver(of => User)
export class ChangeUserStatusResolver {

  @Mutation(returns => User, {
    nullable: true
  })
  async changeStatus(@Ctx() { prisma }: Context, @Args() args: StatusChangeArgs): Promise<User | null> {

    // update the user's status
    const user = await prisma.user.update({
      where: {
        id: args.id
      },
      data: {
        state: args.status
      },
    });

    if (user != null){
      // if it's a leave state, update the total_wait
      const leaveStates = ["SERVICED", "ABANDONED", "NOSHOW", "KICKED"];
      if (leaveStates.includes(args.status)){

        // total_wait = time of leave - join_time (in seconds)
        const leaveTime = new Date();
        const joinTime = user.join_time;
        const totalWait = parseInt("" + ((leaveTime.valueOf() - joinTime.valueOf()) / 1000));

        const updateTotalWait = await prisma.user.update({
          where: {
            id: args.id
          },
          data: {
            total_wait: totalWait
          }
        });

        return updateTotalWait;

      }
    }

    return user;
  }
}

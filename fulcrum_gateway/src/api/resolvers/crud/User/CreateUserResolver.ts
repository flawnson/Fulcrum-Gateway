import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { PrismaClient } from "@prisma/client";

interface Context {
  prisma: PrismaClient;
}

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

@Resolver(of => User)
export class CreateUserResolver {

  @Mutation(returns => User, {
    nullable: true
  })
  async createUser(@Ctx() { prisma }: Context, @Args() args: CreateUserArgs): Promise<User | null> {
    return await prisma.$transaction(async (prisma) => {
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

      // calculate the user's index
      const index = results.users.length + 1;
      const currentTime = new Date();
      const queueId = results.id;
      // create a new user
      const createUser = prisma.user.create({
        data: {
          name: args.name,
          queue_id: queueId,
          phone_number: args.phoneNumber,
          join_time: currentTime,
          index: index
        }
      });
      return createUser;

    })
  }


}

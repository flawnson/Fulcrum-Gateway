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
class SummonUserArgs {
  @Field({
    nullable: false
  })
  id!: string;
}


@Resolver()
export class SummonUserResolver {

  @Mutation(returns => User, {
    nullable: true
  })
  async summon(@Ctx() { prisma }: Context, @Args() args: SummonUserArgs): Promise<User | null> {

    // check if user is ENQUEUED
    const user = await prisma.user.findUnique({
      where: {
        id: args.id
      }
    });

    if (user != null) {
      if (user.status == "ENQUEUED" || user.status == "DEFERRED") {

        const currentTime = new Date();
        // set user summoned_time
        const setSummoned = await prisma.user.update({
          where: {
            id: args.id
          },
          data: {
            summoned_time: currentTime,
            summoned: true
          }
        });

        return setSummoned;
      }
      else {
        console.log("User with id " + args.id + " is not ENQUEUED/DEFERRED status. Can't be summoned. ");
      }
    }
    else {
      console.log("User with id " + args.id + " does not exist");
    }

    return null;
  }
}

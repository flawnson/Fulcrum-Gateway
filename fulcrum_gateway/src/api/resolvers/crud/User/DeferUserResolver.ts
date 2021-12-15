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
class DeferUserArgs {
  @Field({
    nullable: false
  })
  id!: string;

  @Field({
    nullable: false
  })
  time!: string;
}

@Resolver(of => User)
export class DeferUserResolver {

  @Mutation(returns => User, {
    nullable: true
  })
  async deferPosition(@Ctx() { prisma }: Context, @Args() args: DeferUserArgs): Promise<User | null> {
    // May need to import CustomUserResolver to access estimated_wait()

    // const new_wait = await this.estimated_wait(user, {prisma})
    // const result = await prisma.user.update({
    //   where: {
    //     id: user.id
    //   },
    //   data: {
    //     state: "DEFERRED",
    //     estimated_wait: new_wait
    //   }
    // })
    // return result
    return null;
  }
}

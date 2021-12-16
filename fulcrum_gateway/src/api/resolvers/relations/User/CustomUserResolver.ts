import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg,
  InputType, Field
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { PrismaClient } from "@prisma/client";

interface Context {
  prisma: PrismaClient;
}

@InputType({ description: "Data needed to defer user" })
class DeferData implements Partial<User> {
  @Field()
  id?: string;

  @Field()
  time?: string;
}

@Resolver(of => User)
export class CustomUserResolver {

  @FieldResolver(type => Int)
  async estimated_wait(
      @Root() user: User,
      @Ctx() {prisma}: Context,
  ): Promise<number> {
    // const result = await prisma.user.update({
    //   where: {
    //     id: user.id
    //   },
    //   data: {
    //     status: "DEFERRED"
    //   }
    // });

    return 111;
  }

}

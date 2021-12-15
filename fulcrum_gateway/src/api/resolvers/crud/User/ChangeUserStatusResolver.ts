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

@Resolver(of => User)
export class ChangeUserStatusResolver {

  @Mutation(returns => User, {
    nullable: true
  })
  async changeStatus(@Ctx() { prisma }: Context): Promise<User | null> {

    return null;
  }
}

import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { PrismaClient, UserStatus } from "@prisma/client";
import * as helpers from "../../../helpers";

interface Context {
  prisma: PrismaClient;
}

@ArgsType()
class ChangeStatusArgs {
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
  async changeStatus(@Ctx() { prisma }: Context, @Args() args: ChangeStatusArgs): Promise<User | null> {
    const updatedUser = await helpers.updateUserStatus(args.id, args.status);
    return updatedUser;
  }
}

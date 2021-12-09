import {
  Resolver,
  Query,
  FieldResolver,
  Ctx,
  Root,
  Int,
  Args
} from "type-graphql";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { User } from "../../../../../prisma/generated/type-graphql/models/User";
import { QueueUsersArgs } from "../../../../../prisma/generated/type-graphql/resolvers/relations/Queue/args/QueueUsersArgs";
import { PrismaClient } from "@prisma/client";
import { transformFields, getPrismaFromContext, transformCountFieldIntoSelectRelationsCount } from "../../../../../prisma/generated/type-graphql/helpers";

interface Context {
  prisma: PrismaClient;
}

Resolver(of => Queue)
export class CustomQueueResolver {

  @FieldResolver(type => [User], {
    nullable: false
  })
  async help_me(@Root() queue: Queue, @Ctx() { prisma }: Context, @Args() args: QueueUsersArgs): Promise<User[]> {
    return await prisma.queue.findUnique({
      where: {
        id: queue.id,
      },
    }).users(args);
  }

  // @FieldResolver(type => Int, { nullable: true })
  // async num_enqueued(
  //   @Root() queue: Queue,
  //   @Ctx() { prisma }: Context,
  // ): Promise<number | null> {
  //   // const result = await prisma.queue.findUnique({
  //   //   where: {
  //   //     id: queue.id
  //   //   },
  //   //   select: {
  //   //     users: {
  //   //       where: {
  //   //         state: "ENQUEUED"
  //   //       }
  //   //     }
  //   //   }
  //   // });
  //   // const result = await prisma.queue.findUnique({
  //   //   where: {
  //   //     id: queue.id
  //   //   }
  //   // });
  //
  //   //console.log(result);
  //   return 0;
  // }
}

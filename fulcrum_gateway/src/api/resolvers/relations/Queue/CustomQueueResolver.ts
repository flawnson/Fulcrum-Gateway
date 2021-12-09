import {
  Resolver,
  Query,
  FieldResolver,
  Ctx,
  Root,
  Int
} from "type-graphql";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { PrismaClient } from "@prisma/client";

interface Context {
  prisma: PrismaClient;
}

@Resolver(of => Queue)
export class CustomQueueResolver {

  @FieldResolver(type => Int)
  async num_enqueued(
    @Root() queue: Queue,
    @Ctx() { prisma }: Context,
  ): Promise<number> {
    const result = await prisma.queue.findUnique({
      where: {
        id: queue.id
      },
      select: {
        users: {
          where: {
            state: "ENQUEUED"
          }
        }
      }
    });

    return result!.users.length;

  }
}

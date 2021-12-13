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

  @FieldResolver(type => Int)
  async num_serviced(
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
            state: "SERVICED"
          }
        }
      }
    });

    return result!.users.length;
  }

  @FieldResolver(type => Int)
  async num_abandoned(
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
            state: "ABANDONED"
          }
        }
      }
    });

    return result!.users.length;
  }

  @FieldResolver(type => Int)
  async num_kicked(
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
            state: "KICKED"
          }
        }
      }
    });

    return result!.users.length;
  }

  @FieldResolver(type => Int)
  async num_deferred(
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
            state: "DEFERRED"
          }
        }
      }
    });

    return result!.users.length;
  }

  @FieldResolver(type => Int)
  async num_noshow(
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
            state: "NOSHOW"
          }
        }
      }
    });

    return result!.users.length;
  }
}

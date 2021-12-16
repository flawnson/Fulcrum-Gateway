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

  @FieldResolver(type => Int, { nullable: true })
  async average_wait(@Root() queue: Queue, @Ctx() { prisma }: Context): Promise<number | null> {
    // get users of queue
    const results = await prisma.queue.findUnique({
      where: {
        id: queue.id
      },
      select: {
        users: true
      }
    }) || { "users": [] };

    // loop through users to calculate the average wait
    let averageWaitTime = 0;
    let numUsersCount = 0;
    for (let i = 0; i < results.users.length; i++){
      if (results.users[i] != null){
        if (results.users[i].total_wait != null){
          averageWaitTime += results.users[i].total_wait!; // possibly null if no "!" is used
          numUsersCount++;
        }
      }
    }

    if (numUsersCount == 0){
      return null;
    }

    averageWaitTime /= numUsersCount;

    //update average_wait in Queue


    return averageWaitTime;

  }

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

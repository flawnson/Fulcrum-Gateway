import {
  Resolver,
  Query,
  FieldResolver,
  Authorized,
  Ctx,
  Root,
  Int
} from "type-graphql";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import * as helpers from "../../../helpers";
import { Context } from "../../../context.interface";


@Resolver(of => Queue)
export class CustomQueueResolver {

  // average wait statistics
  @Authorized()
  @FieldResolver(type => Int, { nullable: true })
  async average_wait(@Root() queue: Queue, @Ctx() { req, prisma }: Context): Promise<number | null> {
    const averageWaitTime = await helpers.calculateAverageWait(queue.id);
    return averageWaitTime;
  }

  // queue user count statistics
  @Authorized()
  @FieldResolver(type => Int)
  async num_enqueued(@Root() queue: Queue, @Ctx() { req, prisma }: Context): Promise<number> {
    const result = await prisma.queue.findUnique({
      where: {
        id: queue.id
      },
      select: {
        users: {
          where: {
            status: "ENQUEUED"
          }
        }
      }
    }) || { "users": [] };

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
            status: "SERVICED"
          }
        }
      }
    }) || { "users": [] };

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
            status: "ABANDONED"
          }
        }
      }
    }) || { "users": [] };

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
            status: "KICKED"
          }
        }
      }
    }) || { "users": [] };

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
            status: "DEFERRED"
          }
        }
      }
    }) || { "users": [] };

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
            status: "NOSHOW"
          }
        }
      }
    }) || { "users": [] };

    return result!.users.length;
  }
}

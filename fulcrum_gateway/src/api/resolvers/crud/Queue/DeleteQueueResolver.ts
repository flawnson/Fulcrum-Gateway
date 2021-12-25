import {
  Resolver, Query,
  FieldResolver, Ctx,
  Root, Int,
  Mutation, Arg, Args, ArgsType,
  InputType, Field
} from "type-graphql";
import { Queue } from "../../../../../prisma/generated/type-graphql/models/Queue";
import { PrismaClient, Prisma} from "@prisma/client";

interface Context {
  prisma: PrismaClient;
}

@ArgsType()
class DeleteQueueArgs {
  @Field({
    nullable: false
  })
  id!: string;
}

@Resolver(of => Queue)
export class DeleteQueueResolver {

  @Mutation(returns => Queue, {
    nullable: true
  })
  async deleteQueue(@Ctx() { prisma }: Context, @Args() args: DeleteQueueArgs): Promise<Queue | null> {

    // First delete all users in the queue
    const deleteUsers = prisma.user.deleteMany({
      where: {
        queue_id: args.id,
      },
    })

    // Then delete the queue itself
    const deleteQueue = prisma.queue.delete({
      where: {
        id: args.id,
      },
    })

    try {
      const transaction = await prisma.$transaction([deleteUsers, deleteQueue]);
      return transaction[1]; //return the deleted Queue
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2025') {
          console.log('Queue with id ' + args.id + ' does not exist');
        }
      }
      return null; // return null if error
    }


  }

}
